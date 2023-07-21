import { BadRequestException, Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifGateway } from 'src/sockets/notif/notif.gateway';

@Injectable()
export class GameService {
  constructor(
    private notifGateway: NotifGateway,
    private prisma: PrismaService,
  ) {}
  async createGame(fromId: number, toId: number): Promise<Game> {
    const gameRequest = await this.prisma.game.create({
      data: {
        player1Id: fromId,
        player2Id: toId,
      },
    });
    //   .catch((error) => {
    //     if (error.response.status !== 409) console.error(error);
    //   });
    const receiver = await this.prisma.user.findUnique({
      where: { id: toId },
    });
    if (!receiver) {
      throw new BadRequestException();
    }
    this.notifGateway.handleGamesNotif(receiver.login);
    return gameRequest;
  }
}
