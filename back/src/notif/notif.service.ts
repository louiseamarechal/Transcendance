import { Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotifService {
  server: Namespace;
  constructor(private prisma: PrismaService) {}

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
      where: { toId: myId },
    });
    // console.log({ receivedFRRequests });
    // console.log({ myId });
    return receivedFRRequests;
  }

  async getGamesNotif(myId: number) {
    const receivedGameRequests = await this.prisma.game.findMany({
      where: { player2Id: myId },
    });
    // console.log({ receivedGameRequests });
    // console.log({ myId });
    return receivedGameRequests;
  }
}
