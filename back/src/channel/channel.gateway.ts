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
import { Cron } from '@nestjs/schedule';
import { ChannelService } from './channel.service';
import { AtJwt } from 'src/auth/types';
import { SocketService } from 'src/sockets/socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'channel',
})
export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private channelService: ChannelService,
    private socketService: SocketService,
  ) {}

  afterInit(server: Namespace) {
    this.channelService.server = server;
    // this is debug, not necessary for production
    server.use((client: Socket, next) => {
      client.use((event, next) => {
        console.log(
          '\x1b[36m%s\x1b[0m',
          'Middleware: New channel socket event',
          event[0],
        );
        next();
      });
      next();
    });
  }

  async handleConnection(client: Socket) {
    try {
      const token: AtJwt = await this.socketService.verifyToken(client);
      await this.socketService.attachUserDataToClient(client, token);
      console.log(`[ChannelGateway] ${client.data.user.name} arrived`);
    } catch (error) {
      console.log('[ChannelGateway] handleConnection threw:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[ChannelGateway] ${client.data.user.name} left`);
    client.disconnect();
  }

  @WebSocketServer()
  server: Namespace;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  @SubscribeMessage('client.channel.createRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: number,
  ) {
    this.channelService.handleJoinRoom(client, `channel_${channelId}`);
  }

  @SubscribeMessage('client.channel.leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    this.channelService.handleLeaveRoom(client);
  }

  @SubscribeMessage('client.channel.sendMessage')
  handleSendMessage(@MessageBody() channelId: number) {
    this.channelService.handleSendMessage(this.server, channelId);
  }

  // @Cron('*/5 * * * * *')
  // private debug() {
  //   console.log('[Debug ChannelGateway]', { rooms: this.server.adapter.rooms });
  // }
}
