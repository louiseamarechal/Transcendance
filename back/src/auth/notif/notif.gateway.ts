import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { SocketService } from '../../sockets/socket.service';
import { NotifService } from './notif.service';
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
  handleConnection(client: Socket) {
    console.log(`client with id: ${client.id} is connected (notif) !`);
    this.socketService.handleConnection(client, '');
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

  @Cron('*/5 * * * * *')
  private debug() {
    console.log('[Debug NotifGateway]', { rooms: this.server.adapter.rooms });
  }
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
