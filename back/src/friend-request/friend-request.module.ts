import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService, 
  ChannelService ]
})
export class FriendRequestModule {}
