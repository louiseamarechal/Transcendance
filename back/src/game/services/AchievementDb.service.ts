import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Game, GameVisibility } from '../classes/Game';
import { GameSchema } from '../../../../shared/common/types/game.type';
import { GameDbService } from "./gameDb.service";


@Injectable()
export class AchievementDbService {
  constructor(private prisma: PrismaService, private gameDb: GameDbService) {}

  async writeAchievementToDb(game: Game) {
    const p1Id = game.p1.user.id;
    const p2Id = game.p2.user.id;
   
    try {
      const wongamesp1 = await this.getWonGames(p1Id);
      const wongamesp2 = await this.getWonGames(p2Id);
  
      if (wongamesp1 >= 10) {
        await this.prisma.achievements.create({
        data: {
          id : p1Id,
          achievementName : "TENVICTORIES",
          userId : p1Id,
        },
      });
      }
      if (wongamesp2 >= 10) {
        await this.prisma.achievements.create({
          data: {
            id : Number(p2Id),
            achievementName : "TENVICTORIES",
            userId : Number(p2Id),
          },
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  } 

  async getWonGames(p1Id: number): Promise<number> {
    try {
      const gamesp1 = await this.gameDb.getGamesById(p1Id);
      
      const wongames = gamesp1.filter((game : GameSchema) => game.winnerId === p1Id);
  
      return wongames.length;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

}