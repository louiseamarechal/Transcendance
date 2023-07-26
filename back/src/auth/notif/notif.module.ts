import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
import { SocketService } from '../../sockets/socket.service';
import { NotifService } from './notif.service';
import { NotifController } from './notif.controller';

@Module({
  providers: [NotifGateway, SocketService, NotifService],
  exports: [NotifGateway, SocketService, NotifService],
  controllers: [NotifController],
})
export class NotifModule {}
