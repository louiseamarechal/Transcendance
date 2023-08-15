import { ConflictException, Injectable } from '@nestjs/common';
import { NotifService } from 'src/notif/notif.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from './classes/Game';

@Injectable()
export class GameService {
  constructor(
    private notifService: NotifService,
    private prisma: PrismaService,
  ) {}

  async createGameInDb(game: Game) {
    await this.prisma.game.create({
      data: {
        player1Id: game.p1.user.id,
        player2Id: game.p2.user.id,
        uuid: game.gameId,
      },
    });
  }

  // async createGame(fromId: number, toId: number): Promise<Game> {
  //   const gameRequest = await this.prisma.game.create({
  //     data: {
  //       player1Id: fromId,
  //       player2Id: toId,
  //     },
  //   });
  //   const receiver = await this.prisma.user.findUnique({
  //     where: { id: toId },
  //   });
  //   if (receiver === null) {
  //     throw new ConflictException();
  //   }
  //   this.notifService.handleGamesNotif(receiver.login);
  //   return gameRequest;
  // }
}
