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
import { Socket, Namespace } from 'socket.io';
import { GameManager } from './classes/GameManager';
import { AtJwt } from 'src/auth/types';
import { Cron } from '@nestjs/schedule';
import { SocketService } from 'src/sockets/socket.service';
import { ClientEvents } from '../../../shared/client/ClientEvents';
import { ClientPayloads } from '../../../shared/client/ClientPayloads';
import { Logger } from '@nestjs/common';

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
    private socketService: SocketService,
  ) {}

  afterInit(server: Namespace) {
    this.gameManager.server = server;

    // this is debug, not necessary for production
    server.use((client: Socket, next) => {
      client.use((event, next) => {
        Logger.warn(`New Game Event ${event[0]}`);
        next();
      });
      next();
    });
  }

  async handleConnection(client: Socket) {
    try {
      const token: AtJwt = await this.socketService.verifyToken(client);
      await this.socketService.attachUserDataToClient(client, token);
      console.log(`[GameGateway] ${client.data.user.name} arrived`);
    } catch (error) {
      console.log('[GameGateway] handleConnection threw:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[GameGateway] ${client.data?.user?.name} left`);
    client.disconnect();
  }

  @SubscribeMessage(ClientEvents.GameInput)
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ClientPayloads[ClientEvents.GameInput],
  ) {
    this.gameManager.handleInput(
      client.data.user.id,
      // ...payload,
      payload.gameId,
      payload.val,
    );
  }

  @SubscribeMessage(ClientEvents.GameJoinQueue)
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.gameManager.joinQueue(client);
  }

  @SubscribeMessage(ClientEvents.GameLeaveQueue)
  handleLeaveQueue() {
    this.gameManager.leaveQueue();
  }

  @SubscribeMessage(ClientEvents.GameSetReady)
  handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ClientPayloads[ClientEvents.GameSetReady],
  ) {
    this.gameManager.setReady(client.data.user.id, payload.gameId);
  }

  // @Cron('*/5 * * * * *')
  // private debug() {
  //   console.log('[Debug GameGateway] ', { rooms: this.server.adapter.rooms });
  // }
}
