import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { NotifService } from './notif.service';
import { SocketService } from 'src/sockets/socket.service';
import { AtJwt } from 'src/auth/types';
import { Cron } from '@nestjs/schedule';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notif',
})
export class NotifGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private socketService: SocketService,
    private notifService: NotifService,
  ) {}
  @WebSocketServer()
  server: Namespace;

  afterInit(server: Namespace) {
    console.log('NotifGateway on')
    this.notifService.server = server;
  }

  // handle connection
  async handleConnection(client: Socket) {
    try {
      const token: AtJwt = await this.socketService.verifyToken(client);
      await this.socketService.attachUserDataToClient(client, token);
      console.log(`[NotifGateway] ${client.data.user.name} arrived`);
      const room: string = client.data.user.login;
      client.join(room);
      // if (client.rooms.has(room)) {
      //   console.log('Success, you just joined the room !', room);
      //   console.log(client.rooms.size);
      //   client.rooms.forEach((key) => {
      //     console.log(key);
      //   });
      // }
    } catch (error) {
      console.log('[NotifGateway] handleConnection threw:', error.message);
      client.disconnect();
    }
  }

  // handle disconnect
  handleDisconnect(client: Socket) {
    console.log(`[NotifGateway] ${client.data?.user?.name} left`);
    client.disconnect();
  }

  @SubscribeMessage('client.notif.chatNotif')
  handleChatNotif(@MessageBody() roomName: string) {
    console.log(`receiving chat notif on socket for ${roomName}`);
    this.notifService.handleChatNotif(roomName);
  }

  // handleGamesNotif(@MessageBody() data: string) {
  //   this.notifService.handleGamesNotif(data, this.server);
  // }
  // @SubscribeMessage('join-room')
  // handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: string,
  // ): string {
  //   this.notifService.handleJoinRoom(client, data);
  //   return data;
  // }

  // handleFriendsRequestNotif() {
  //   this.server.emit('friendsNotif');
  // }

  // @Cron('*/5 * * * * *')
  // private debug() {
  //   console.log('[Debug NotifGateway] ', { rooms: this.server.adapter.rooms });
  // }
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
