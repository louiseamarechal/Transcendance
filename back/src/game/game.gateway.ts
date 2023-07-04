import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'src/common/middleware/ws.mw';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'game' })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    console.log('Websocket on');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Someone connect');
  }

  handleDisconnect(client: any) {
    console.log('Someone disconnect');
  }

  @SubscribeMessage('input')
  handleMessage(client: any, payload: any): string {
    console.log('received a game input', { payload });
    return 'Yooooo';
  }
}
