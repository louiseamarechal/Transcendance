import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';

@Module({
  providers: [NotifGateway],
})
export class NotifModule {}
