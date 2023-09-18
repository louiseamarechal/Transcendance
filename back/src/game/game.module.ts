import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifModule } from 'src/notif/notif.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/sockets/socket.module';

import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameManagerService } from './services/gameManager.service';
import { GameDbService } from './services/gameDb.service';
import { AchievementDbService } from './services/AchievementDb.service';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    NotifModule,
    UserModule,
    SocketModule,
  ],
  providers: [GameGateway, GameManagerService, GameDbService, AchievementDbService],
  controllers: [GameController],
})
export class GameModule {}
