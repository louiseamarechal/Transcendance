import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, GameVisibility } from '../classes/Game';
import { GameSchema } from '../../../../shared/common/types/game.type';
import { GameDbService } from './gameDb.service';

@Injectable()
export class AchievementDbService {
  constructor(
    private prisma: PrismaService,
    private gameDb: GameDbService,
  ) {}

  async writeAchievementToDb(game: Game) {
    const p1Id = game.p1.user.id;
    const p2Id = game.p2.user.id;
    const levelp1 = await this.prisma.user.findUnique({
      where: { id: p1Id },
      select: { level: true },
    });
    const levelp2 = await this.prisma.user.findUnique({
      where: { id: p2Id },
      select: { level: true },
    });
    try {
      const wongamesp1 = await this.getWonGames(p1Id);
      const wongamesp2 = await this.getWonGames(p2Id);
      // const wongamewinner = await this.getWonGames(game.)
      if (wongamesp1 > 0) {
        await this.prisma.achievements.upsert({
          where: {
            userId_achievementName: {
              userId: p1Id,
              achievementName: 'FIRSTVICTORY',
            },
          },
          update: {},
          create: {
            userId: p1Id,
            achievementName: 'FIRSTVICTORY',
          },
        });
      }
      if (wongamesp2 > 0) {
        await this.prisma.achievements.upsert({
          where: {
            userId_achievementName: {
              userId: p2Id,
              achievementName: 'FIRSTVICTORY',
            },
          },
          update: {},
          create: {
            userId: p2Id,
            achievementName: 'FIRSTVICTORY',
          },
        });
      }
      if (wongamesp1 >= 10) {
        await this.prisma.achievements.upsert({
          where: {
            userId_achievementName: {
              userId: p1Id,
              achievementName: 'TENVICTORIES',
            },
          },
          update: {},
          create: {
            userId: p1Id,
            achievementName: 'TENVICTORIES',
          },
        });
      }
      if (wongamesp2 >= 10) {
        await this.prisma.achievements.upsert({
          where: {
            userId_achievementName: {
              userId: p2Id,
              achievementName: 'TENVICTORIES',
            },
          },
          update: {},
          create: {
            userId: p2Id,
            achievementName: 'TENVICTORIES',
          },
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (game.score[0] === 0 && game.score[1] === 10) {
      await this.prisma.achievements.upsert({
        where: {
          userId_achievementName: { userId: p1Id, achievementName: 'LOOSER' },
        },
        update: {},
        create: {
          userId: p1Id,
          achievementName: 'LOOSER',
        },
      });
    }
    if (game.score[1] === 0 && game.score[0] === 10) {
      await this.prisma.achievements.upsert({
        where: {
          userId_achievementName: { userId: p2Id, achievementName: 'LOOSER' },
        },
        update: {},
        create: {
          userId: p2Id,
          achievementName: 'LOOSER',
        },
      });
    }
    console.log(game.p1.user.level);
    if (levelp1 === null || levelp2===null) {throw new ConflictException("level p1 or p2 null") }
    if (levelp1.level >= 10.0) {
      await this.prisma.achievements.upsert({
        where: {
          userId_achievementName: { userId: p1Id, achievementName: 'LEVEL10' },
        },
        update: {},
        create: {
          userId: p1Id,
          achievementName: 'LEVEL10',
        },
      });
    }
    if (levelp2.level >= 10.0) {
      await this.prisma.achievements.upsert({
        where: {
          userId_achievementName: { userId: p2Id, achievementName: 'LEVEL10' },
        },
        update: {},
        create: {
          userId: p2Id,
          achievementName: 'LEVEL10',
        },
      });
    }
  }

  async getWonGames(p1Id: number): Promise<number> {
    try {
      const gamesp1 = await this.gameDb.getGamesById(p1Id);

      const wongames = gamesp1.filter(
        (game: GameSchema) => game.winnerId === p1Id,
      );
      console.log(`${p1Id} won games: ${wongames}`);
      return wongames.length;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}