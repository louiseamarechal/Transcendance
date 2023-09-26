import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, GameVisibility } from '../classes/Game';
import { GameSchema } from '../../../../shared/common/types/game.type';
// import { Game as GameSchema } from '@prisma/client';

@Injectable()
export class GameDbService {
  constructor(private prisma: PrismaService) {}

  async writeToDb(game: Game) {
    console.log('[GameGb] writeToDb');
    const p1Id = game.p1.user.id;
    const p1Name = game.p1.user.name;
    const p2Id = game.p2.user.id;
    const p2Name = game.p2.user.name;
    const isPrivate = game.visibility === GameVisibility.Private ? true : false;
    const score1 = game.score[0];
    const score2 = game.score[1];
    const winnerId = score1 > score2 ? p1Id : p2Id;
    const loserId = score1 > score2 ? p2Id : p1Id;
    await this.prisma.game.create({
      data: {
        uuid: game.gameId,
        player1Id: p1Id,
        player1Name: p1Name,
        player2Id: p2Id,
        player2Name: p2Name,
        private: isPrivate,
        winnerId: winnerId,
        score1: score1,
        score2: score2,
      },
    });

    await this.prisma.user.update({
      where: { id: winnerId },
      data: { level: { increment: 1 } },
    });

    await this.prisma.user.update({
      where: { id: loserId },
      data: { level: { increment: 0.2 } },
    });
  }

  async getGamesById(id: number) {
    const games: GameSchema[] = await this.prisma.game.findMany({
      where: { OR: [{ player1Id: id }, { player2Id: id }] },
    });
    return games;
  }
}
