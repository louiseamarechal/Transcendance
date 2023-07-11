import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

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
      data: { playerId: userId },
    });
  }

  // async getLeaveQueue(userId: number) {
  //   await this.prisma.gameQueue.deleteMany({
  //     where: { playerId: userId },
  //   });
  // }

  async getStartGame(userId: number) {
    const queue = await this.getQueue();
    if (queue.length === 0) {
      throw new Error('Cannot start game');
    }

    const gameId = uuid();
    console.log('start new game', gameId)
    return gameId;
  }
}
