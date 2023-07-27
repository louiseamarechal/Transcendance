import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { Socket, Server, Namespace } from 'socket.io';
import { SocketAuthMiddleware } from 'src/common/middleware/ws.mw';
import { GameManager } from './classes/GameManager';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AtJwt } from 'src/auth/types';
import { PublicUser } from 'src/user/types';
import { LoggingInterceptor } from './interceptors/game-ws.interceptor';
import { Cron } from '@nestjs/schedule';
// import { ClientEvents } from '../../../shared/client/ClientEvents';
// import { ClientPayloads } from '../../../shared/client/ClientPayloads';

// @UseGuards(WsJwtGuard)

// @UseInterceptors(LoggingInterceptor)
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Namespace;

  constructor(
    private readonly gameManager: GameManager,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Namespace) {
    this.gameManager.server = server;

    // this is debug, not necessary for production
    server.use((client: Socket, next) => {
      client.use((event, next) => {
        console.log(
          '\x1b[36m%s\x1b[0m',
          'Middleware: New socket event',
          event[0],
        );
        next();
      });
      next();
    });
  }

  async handleConnection(client: Socket) {
    console.log('New websocket connection');
    try {
      // check jwt
      const token: AtJwt = await this.jwt.verifyAsync(
        client.handshake.auth.token,
      ); // throw if invalid, expired or missing
      // console.log(token);
      // if good, link socket to user, set user state online
      const user: PublicUser = await this.userService.getUserById(token.id);
      client.data.user = user;
      // update to online ??
    } catch (error) {
      console.log('handleConnection threw:', error.message);
      client.disconnect();
      // disconnect
    }
  }

  handleDisconnect(client: Socket) {
    const user: PublicUser = client.data.user;
    console.log(`${user?.name} left (id #${user?.id})`);
    client.disconnect();
  }

  @SubscribeMessage('client.game.input')
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; val: number },
  ) {
    this.gameManager.handleInput(
      payload.gameId,
      client.data.user.id,
      payload.val,
    );
  }

  @SubscribeMessage('client.game.joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.gameManager.joinQueue(client);
  }

  @SubscribeMessage('client.game.leaveQueue')
  handleLeaveQueue() {
    this.gameManager.leaveQueue();
  }

  @SubscribeMessage('client.game.setReady')
  handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string },
  ) {
    this.gameManager.setReady(payload.gameId, client.data.user.id);
  }

  @Cron('*/5 * * * * *')
  private debug() {
    console.log('[Debug GameGateway] ', { rooms: this.server.adapter.rooms });
  }
}