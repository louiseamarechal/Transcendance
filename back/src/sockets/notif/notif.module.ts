import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
// import { NotifController } from './notif.controller';
import { SocketService } from '../socket.service';
import { NotifService } from './notif.service';

@Module({
  providers: [NotifGateway, SocketService, NotifService],
  exports: [NotifGateway, SocketService, NotifService],
  // controllers: [NotifController],
})
export class NotifModule {}
