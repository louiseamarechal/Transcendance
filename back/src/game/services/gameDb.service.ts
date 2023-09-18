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
  // async getMyGames(userId: number): Promise<GameSchema[]> {
  //   const games: GameSchema[] = await this.prisma.game.findMany({
  //     where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
  //   });
  //   return games;
  // }

  async getGamesById(id: number) {
    const games: GameSchema[] = await this.prisma.game.findMany({
      where: { OR: [{ player1Id: id }, { player2Id: id }] },
    });
    return games;
  }

  // async writeAchievementToDb(game: Game) {
  //   const p1Id = game.p1.user.id;
  //   const p2Id = game.p2.user.id;; 
  //   const nbvictoriesp1 = this.prisma.user.findUnique({
  //     where: { id: p1Id },  
  //     select: { wonGames : true },
  //   });
  //   const nbvictoriesp2 = this.prisma.user.findUnique({
  //     where: { id: p1Id },  
  //     select: { wonGames : true },
  //   });
  //   console.log('numbers of victories player one', nbvictoriesp1);
  //   if (Number(nbvictoriesp1) >= 2)
  //   {
  //     await this.prisma.achievements.create({
  //       data: {
  //         id : p1Id,
  //         achievementName : "TENVICTORIES",
  //         userId : p1Id,
  //       },
  //     });
  //   }
  //   if (Number(nbvictoriesp2) >= 10)
  //   {
  //     await this.prisma.achievements.create({
  //       data: {
  //         id : Number(p2Id),
  //         achievementName : "TENVICTORIES",
  //         userId : Number(p2Id),
  //       },
  //     });
  //   }
  // }

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

// write achievements on Db
