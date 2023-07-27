import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { NotifGateway } from 'src/sockets/notif/notif.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifModule } from 'src/sockets/notif/notif.module';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  controllers: [FriendRequestController],
  providers: [
    FriendRequestService,
    ChannelService,
    PrismaService,
    NotifGateway,
  ],
  imports: [NotifModule],
})
export class FriendRequestModule {}
