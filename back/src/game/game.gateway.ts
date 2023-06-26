import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'game' })
export class GameGateway {
  @SubscribeMessage('game-input')
  handleMessage(client: any, payload: any): string {
    return 'Yooooo';
  }
}
