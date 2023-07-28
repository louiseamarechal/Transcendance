import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { NotifService } from './notif.service';
import { SocketService } from 'src/sockets/socket.service';
import { AtJwt } from 'src/auth/types';

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

  afterInit(server: Server) {
    console.log('notifGateway running')
    this.notifService.server = server;

    // this is debug, not necessary for production
    server.use((client: Socket, next) => {
      client.use((event, next) => {
        console.log(
          '\x1b[36m%s\x1b[0m',
          'Middleware: New socket event',
          event[0],
        );
        next();
      });
      next();
    });
  }

  // handle connection
  async handleConnection(client: Socket) {
    try {
      const token: AtJwt = await this.socketService.verifyToken(client);
      await this.socketService.attachUserDataToClient(client, token);
      const room: string = client.data.user.login;
      client.join(room);
      if (client.rooms.has(room)) {
        console.log('Success, you just joined the room !', room);
        console.log(client.rooms.size);
        client.rooms.forEach((key) => {
          console.log(key);
        });
      }
    } catch {
      client.disconnect();
    }
  }

  // handle disconnect
  handleDisconnect(client: Socket) {
    // this.notifService.handleDisconnect(client, userLogin, '');
    console.log(`client with id: ${client.id} has left the connection (notif) !`);
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
  //   console.log('[Debug NotifGateway]', { rooms: this.server.adapter.rooms });
  // }
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
