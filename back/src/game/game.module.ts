import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameManager } from './classes/GameManager';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifModule } from 'src/auth/notif/notif.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifGateway } from 'src/auth/notif/notif.gateway';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotifModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GameGateway, GameService, GameManager, PrismaService, NotifGateway],
  controllers: [GameController],
})
export class GameModule {}
