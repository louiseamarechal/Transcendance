import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, GameVisibility } from '../classes/Game';
import { Game as GameSchema } from '@prisma/client';

@Injectable()
export class GameDbService {
  constructor(private prisma: PrismaService) {}

  async writeToDb(game: Game) {
    const p1Id = game.p1.user.id;
    const p2Id = game.p2.user.id;
    const isPrivate = game.visibility === GameVisibility.Private ? true : false;
    const score1 = game.score[0];
    const score2 = game.score[1];
    const winnerId = score1 > score2 ? p1Id : p2Id;
    await this.prisma.game.create({
      data: {
        uuid: game.gameId,
        player1Id: p1Id,
        player2Id: p2Id,
        private: isPrivate,
        winnerId: winnerId,
        score1: score1,
        score2: score2,
      },
    });
  }

  // async createGame(game: Game) {
  //   console.log('[GameDb] createGame', game.gameId);

  //   const data = {
  //     uuid: game.gameId,
  //     player1Id: game.p1.user.id,
  //     player2Id: game.p2.user?.id,
  //     private: game.visibility === GameVisibility.Private ? true : false,
  //   };

  //   try {
  //     await this.prisma.game.create({ data: data });
  //   } catch (error) {
  //     console.log('[GameDb] createGame failed...');
  //     // throw error;
  //   }
  // }

  // async updateGame(game: Game) {
  //   console.log('[GameDb] updateGame', game.gameId);
  //   try {
  //     const player1Id = game.p1.user.id;
  //     const player2Id = game.p2?.user.id;

  //     let winnerId = null;
  //     if (game.score[0] === game.maxScore || game.score[1] === game.maxScore) {
  //       winnerId = game.score[0] > game.score[1] ? player1Id : player2Id;
  //     }

  //     await this.prisma.game.update({
  //       where: { uuid: game.gameId },
  //       data: {
  //         player2Id: game.p2.user.id,
  //         score1: game.score[0],
  //         score2: game.score[1],
  //         winnerId: winnerId,
  //       },
  //     });
  //   } catch (error) {
  //     console.log('[GameDb] updateGame failed...');
  //     // throw error;
  //   }
  // }

  // async deleteGame(game: Game) {
  //   console.log('[GameDb] deleteGame', game.gameId);
  //   try {
  //     await this.prisma.game.delete({ where: { uuid: game.gameId } });
  //   } catch (error) {
  //     console.log('[GameDb] deleteGame failed...');
  //     // throw error;
  //   }
  // }
}
