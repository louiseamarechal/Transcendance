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
import { NotifService } from './notif.service';
import { SocketService } from 'src/sockets/socket.service';
import { AtJwt } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notif',
})
export class NotifGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private notifService: NotifService,
    private prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Namespace;

  afterInit(server: Namespace) {
    console.log('NotifGateway on');
    this.notifService.server = server;

    // this is debug, not necessary for production
    server.use((client: Socket, next) => {
      client.use((event, next) => {
        // console.log(
        //   '\x1b[36m%s\x1b[0m',
        //   'Middleware: New socket event',
        //   event[0],
        // );
        next();
      });
      next();
    });
  }

  // handle connection
  async handleConnection(client: Socket) {
    try {
      const token: AtJwt = await this.socketService.verifyToken(client);
      await this.socketService.attachUserDataToClient(client, token);
      console.log(`[NotifGateway] ${client.data.user.name} arrived`);
      const room: string = client.data.user.login;
      console.log({ dataHandleConnection: client.data.user });
      client.join(room);
      // this.userService.editUser(client.data.user.id, {
      //   status: UserStatus.ONLINE,
      // });
    } catch (error) {
      console.log('[NotifGateway] handleConnection threw:', error.message);
      client.disconnect();
    }
  }

  // handle disconnect
  handleDisconnect(client: Socket) {
    console.log(`[NotifGateway] ${client.data?.user?.name} left`);
    if (client.data.user?.id) {
      this.userService.editUser(client.data.user.id, {
        status: UserStatus.OFFLINE,
      });
      client.disconnect();
    }
  }

  @SubscribeMessage('client.notif.chatNotif')
  handleChatNotif(@MessageBody() roomName: string) {
    console.log(`receiving chat notif on socket for ${roomName}`);
    this.notifService.handleChatNotif(roomName);
  }

  @SubscribeMessage('client.notif.ping')
  handleNotifPing(
    @MessageBody() location: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.notifService.handleNotifPing(location, client);
  }

  // handleGamesNotif(@MessageBody() data: string) {
  //   this.notifService.handleGamesNotif(data, this.server);
  // }
  // @SubscribeMessage('join-room')
  // handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: string,
  // ): string {
  //   this.notifService.handleJoinRoom(client, data);
  //   return data;
  // }

  // handleFriendsRequestNotif() {
  //   this.server.emit('friendsNotif');
  // }

  // @Cron('*/5 * * * * *')
  // private debug() {
  //   console.log('[Debug NotifGateway] ', { rooms: this.server.adapter.rooms });
  // }
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
