import { UseGuards } from '@nestjs/common';
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
import { Socket, Server } from 'socket.io';
import { SocketAuthMiddleware } from 'src/common/middleware/ws.mw';
// import { ClientEvents } from '../../../shared/client/ClientEvents';
// import { ClientPayloads } from '../../../shared/client/ClientPayloads';

// @UseGuards(WsJwtGuard)
@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server

  afterInit(client: Socket) {
    // client.use(SocketAuthMiddleware() as any);
    console.log('Websocket on');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const data: any = client.handshake.auth.data;
    console.log(`${data?.name} arrived (id #${data?.id})`);
    client.join(data?.name);
  }

  handleDisconnect(client: any) {
    const data: any = client.handshake.auth.data;
    console.log(`${data?.name} left (id #${data?.id})`);
  }

  // @SubscribeMessage(ClientEvents.GameInput)
  // handleInput(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: ClientPayloads[ClientEvents.GameInput],
  // ): string {
  //   console.log('received a game input', { payload });
  //   return 'Yooooo';
  // }

  @SubscribeMessage('client.game.input')
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): string {
    console.log('received a game input', { payload });
    return 'Yooooo';
  }

  // @SubscribeMessage('toto')
  // handleToto(client: Socket, payload: any) {
  //   console.log('yeah')
  //   return 'yo'
  // }
}
