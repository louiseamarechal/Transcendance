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
import { SocketService } from '../../sockets/socket.service';
import { NotifService } from './notif.service';

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
  server: Server;

  afterInit(server: Server) {
    this.notifService.server = server;
  }

  // handle connection
  handleConnection(client: Socket) {
    // console.log(`client with id: ${client.id} is connected !`);
    this.socketService.handleConnection(client, '');
  }

  // handle disconnect
  handleDisconnect(client: Socket) {
    // this.notifService.handleDisconnect(client, userLogin, '');
    console.log(`client with id: ${client.id} has left the connection !`);
  }

  @SubscribeMessage('client.notif.chatNotif')
  handleFriendsNotif(@MessageBody() roomName: string) {
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
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
