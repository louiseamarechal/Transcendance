import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Server } from 'http';

@Injectable()
export class NotifService {
  constructor(
    private socketService: SocketService,
    private prisma: PrismaService,
  ) {}

  handleFriendsNotif(roomName: string, server: Server) {
    console.log('sending FR on room', roomName);
    server.to(roomName).emit('friends-notif');
  }

  async getNotif(myId: number) {
    const receivedFRRequests = await this.prisma.friendRequest.findMany({
      where: { toId: myId },
    });
    console.log({ receivedFRRequests });
    console.log({ myId });
    return receivedFRRequests;
  }
}
