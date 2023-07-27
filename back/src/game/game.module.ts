import { Module } from '@nestjs/common';
import { NotifGateway } from 'src/auth/notif/notif.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifModule } from 'src/auth/notif/notif.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  providers: [GameService, PrismaService, NotifGateway],
  imports: [NotifModule],
})
export class GameModule {}
