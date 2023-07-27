import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotifService {
  server: Server;
  constructor(private prisma: PrismaService) {}

  handleFriendsNotif(roomName: string) {
    console.log('sending Friend Request on room', roomName);
    this.server.to(roomName).emit('server.notif.friends');
  }

  handleGamesNotif(roomName: string) {
    console.log('sending Game Request on room', roomName);
    this.server.to(roomName).emit('server.notif.game');
  }

  handleChatNotif(roomName: string) {
    console.log({ roomName });
    this.server.to(roomName).emit('server.notif.chat');
  }

  async getFriendsNotif(myId: number) {
    const receivedFRRequests = await this.prisma.friendRequest.findMany({
      where: { toId: myId },
    });
    console.log({ receivedFRRequests });
    console.log({ myId });
    return receivedFRRequests;
  }

  async getGamesNotif(myId: number) {
    const receivedGameRequests = await this.prisma.game.findMany({
      where: { player2Id: myId },
    });
    console.log({ receivedGameRequests });
    console.log({ myId });
    return receivedGameRequests;
  }
}
