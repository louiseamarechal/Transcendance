import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { NotifGateway } from './notif/notif.gateway';

@Module({
  providers: [ChatGateway, NotifGateway]
})
export class GatewayModule {}
