import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifModule } from 'src/notif/notif.module';
import { SocketModule } from 'src/sockets/socket.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotifModule, SocketModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
})
export class ChannelModule {}
