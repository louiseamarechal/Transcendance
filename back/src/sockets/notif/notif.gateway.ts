import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  // handle connection
  handleConnection(client: any) {
    console.log(`client with id: ${client.id} is connected !`);
  }

  // handle disconnect
  handleDisconnect(client: any) {
    console.log(`client with id: ${client.id} has left the connection !`);
  }

  testNotif() {
    this.server.emit('notif', '1');
    // console.log(this.server);
  }

  // listen for friends request

  // listen for game request

  // listen for chat request
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
