import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log({ data, client });
    client.broadcast.emit(
      'chat',
      `Received message from ${client.id} (broadcast)`,
    );
    client.emit(
      'chat',
      `Received message from ${client.id}`,
    );
    return data;
  }
}
