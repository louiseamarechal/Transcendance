import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  // listen for friends request
  // listen for game request
  // listen for chat request
}
