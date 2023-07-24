import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { ChannelService } from 'src/channel/channel.service';
import { NotifGateway } from 'src/sockets/notif/notif.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifModule } from 'src/sockets/notif/notif.module';

@Module({
  controllers: [FriendRequestController],
  providers: [
    FriendRequestService,
    PrismaService,
    NotifGateway,
    ChannelService,
  ],
  imports: [NotifModule],
})
export class FriendRequestModule {}
