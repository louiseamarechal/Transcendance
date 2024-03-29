import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { GameModule } from './game/game.module';
import { MailModule } from './mail/mail.module';
import { NotifModule } from './notif/notif.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    FriendRequestModule,
    ChannelModule,
    MessageModule,
    NotifModule,
    GameModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
