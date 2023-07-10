import { Injectable } from '@nestjs/common';
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
    
  }
}
