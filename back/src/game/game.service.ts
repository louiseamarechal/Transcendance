import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getQueue() {
    const queue = await this.prisma.gameQueue.findMany();
    console.log({ queue });
    return queue;
  }

  async getJoinQueue(userId: number) {
    await this.prisma.gameQueue.create({
      data: {
        playerId: userId,
      },
    });
  }
}
