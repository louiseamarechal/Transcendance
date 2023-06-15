import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotifGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notif')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log({ data, client });
    client.emit('notif', `Received: ${data}`);
    return data;
  }
}
