import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ChannelModule],
  providers: [
    // {
    //   provide: APP_GUARD,
      // useClass: JwtGuard, // Change name for global guard !
    // },
  ],
})
export class AppModule {}
