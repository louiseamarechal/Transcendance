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
import { GameManager } from './classes/GameManager';
import { JwtService } from '@nestjs/jwt';
// import { ClientEvents } from '../../../shared/client/ClientEvents';
// import { ClientPayloads } from '../../../shared/client/ClientPayloads';

// @UseGuards(WsJwtGuard)
@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameManager: GameManager,
    private readonly jwt: JwtService,
  ) {}

  afterInit(server: Server) {
    this.gameManager.server = server;
    console.log('Websocket on');
  }

  async handleConnection(client: Socket) {
    try {
      // check jwt
      const token = await this.jwt.verifyAsync(client.handshake.auth.token);
      console.log(token);
      // if not good, disconnect
      if (!token) {
        throw new Error('Token not valid');
      }
      // if good, link socket to user, set user state online
    } catch (error) {
      console.log('handleConnection threw', error);
      client.disconnect();
      // disconnect
    }
  }

  handleDisconnect(client: any) {
    // const data: any = client.handshake.auth.data;
    // console.log(`${data?.name} left (id #${data?.id})`);
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
