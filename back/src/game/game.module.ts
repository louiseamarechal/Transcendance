import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameManager } from './classes/GameManager';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifModule } from 'src/notif/notif.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/sockets/socket.module';
import { Game } from './classes/Game';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    NotifModule,
    UserModule,
    SocketModule,
  ],
  providers: [GameGateway, GameService, GameManager],
  controllers: [GameController],
})
export class GameModule {}
