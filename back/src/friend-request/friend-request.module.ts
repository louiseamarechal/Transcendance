import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { ChannelService } from 'src/channel/channel.service';
import { NotifModule } from 'src/notif/notif.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService, ChannelService],
  imports: [NotifModule, PrismaModule],
})
export class FriendRequestModule {}
