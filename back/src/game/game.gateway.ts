import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'game' })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{

  afterInit(server: any) {
    console.log('Websocket on')
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Someone connect')
  }

  handleDisconnect(client: any) {
    console.log('Someone disconnect')
  }

  @SubscribeMessage('game-input')
  handleMessage(client: any, payload: any): string {
    console.log('received a game input')
    return 'Yooooo';
  }
}
