import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { ChannelService } from 'src/channel/channel.service';
import { NotifGateway } from 'src/auth/notif/notif.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifModule } from 'src/auth/notif/notif.module';
import { NotifService } from 'src/auth/notif/notif.service';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService, PrismaService, ChannelService],
  imports: [NotifModule],
})
export class FriendRequestModule {}
