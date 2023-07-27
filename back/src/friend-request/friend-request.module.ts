import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { ChannelService } from 'src/channel/channel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifModule } from 'src/auth/notif/notif.module';


@Module({
  controllers: [FriendRequestController],
  providers: [
    FriendRequestService,
    ChannelService,
    PrismaService,
  ],
  imports: [NotifModule],
})
export class FriendRequestModule {}
