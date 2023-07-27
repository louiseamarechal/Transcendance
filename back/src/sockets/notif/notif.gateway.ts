import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketService } from '../socket.service';
import { NotifService } from './notif.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private notifService: NotifService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
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

  // @SubscribeMessage('friends-notif')
  handleFriendsNotif(@MessageBody() data: string) {
    this.notifService.handleFriendsNotif(data, this.server);
  }

  handleGamesNotif(@MessageBody() data: string) {
    this.notifService.handleGamesNotif(data, this.server);
  }
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
