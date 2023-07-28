import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifModule } from 'src/notif/notif.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotifModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
})
export class ChannelModule {}
