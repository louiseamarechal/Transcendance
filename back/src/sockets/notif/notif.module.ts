import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
import { NotifController } from './notif.controller';

@Module({
  providers: [NotifGateway],
  controllers: [NotifController],
})
export class NotifModule {}
