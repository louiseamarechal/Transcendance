import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { SocketService } from 'src/sockets/socket.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway, SocketService],
})
export class ChannelModule {}
