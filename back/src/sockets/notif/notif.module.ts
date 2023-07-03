import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
import { NotifController } from './notif.controller';
// import { NotifService } from './socket.service';

@Module({
  providers: [NotifGateway],
  controllers: [NotifController],
})
export class NotifModule {}
