import { ConflictException, Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifService } from 'src/auth/notif/notif.service';

@Injectable()
export class GameService {
  constructor(
    private notifService: NotifService,
    private prisma: PrismaService,
  ) {}
  async createGame(fromId: number, toId: number): Promise<Game> {
    const gameRequest = await this.prisma.game.create({
      data: {
        player1Id: fromId,
        player2Id: toId,
      },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { id: toId },
    });
    if (receiver === null) {
      throw new ConflictException();
    }
    this.notifService.handleGamesNotif(receiver.login);
    return gameRequest;
  }
}
