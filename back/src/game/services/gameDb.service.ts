import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '../classes/Game';

@Injectable()
export class GameDbService {
  constructor(private prisma: PrismaService) {}

  async createGame(game: Game) {
    console.log('[GameDb] createGame', game.gameId);
    try {
      await this.prisma.game.create({
        data: {
          uuid: game.gameId,
          player1Id: game.p1.user.id,
        },
      });
    } catch (error) {
      console.log('[GameDb] createGame failed...');
      throw error;
    }
  }

  async updateGame(game: Game) {
    console.log('[GameDb] updateGame', game.gameId);
    try {
      const player1Id = game.p1.user.id;
      const player2Id = game.p2?.user.id;

      let winnerId = null;
      if (game.score[0] === game.maxScore || game.score[1] === game.maxScore) {
        winnerId = game.score[0] > game.score[1] ? player1Id : player2Id;
      }

      await this.prisma.game.update({
        where: { uuid: game.gameId },
        data: {
          player2Id: game.p2.user.id,
          score1: game.score[0],
          score2: game.score[1],
          winnerId: winnerId,
        },
      });
    } catch (error) {
      console.log('[GameDb] updateGame failed...');
      throw error;
    }
  }

  async deleteGame(game: Game) {
    console.log('[GameDb] deleteGame', game.gameId);
    try {
      await this.prisma.game.delete({ where: { uuid: game.gameId } });
    } catch (error) {
      console.log('[GameDb] deleteGame failed...');
      throw error;
    }
  }
}
