import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class NotifGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Init');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Connection');
  }

  handleDisconnect(client: any) {
    console.log('Disconnection');
  }

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
