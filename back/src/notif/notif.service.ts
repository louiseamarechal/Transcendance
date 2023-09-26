import { Injectable } from '@nestjs/common';
import { FRStatus, UserStatus } from '@prisma/client';
import { Socket } from 'socket.io';
import { Namespace } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class NotifService {
  server: Namespace;
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  handleFriendsNotif(roomName: string) {
    this.server.to(roomName).emit('server.notif.friends');
  }

  handleGamesNotif(roomName: string) {
    this.server.to(roomName).emit('server.notif.game');
  }

  handleChatNotif(roomName: string) {
    console.log(`accessing handleChatNotif(${roomName})`);
    this.server.to(roomName).emit('server.notif.chat');
  }

  async getFriendsNotif(myId: number) {
    const receivedFRRequests = await this.prisma.friendRequest.findMany({
      where: {
        toId: myId,
        status: {
          equals: FRStatus.PENDING,
        },
      },
    });
    return receivedFRRequests;
  }

  async getGamesNotif(myId: number) {
    const receivedGameRequests = await this.prisma.game.findMany({
      where: { player2Id: myId },
    });
    return receivedGameRequests;
  }

  async handleNotifPing(location: string, client: Socket) {
    if (!client.data?.user) {
      return;
    }

    const lastSegment = location.split('/').at(-1);

    if (lastSegment && isUUID(lastSegment)) {
      this.userService.editUser(client.data.user.id, {
        status: UserStatus.PLAYING,
      });
    } else {
      this.userService.editUser(client.data.user.id, {
        status: UserStatus.ONLINE,
      });
    }
  }
}
