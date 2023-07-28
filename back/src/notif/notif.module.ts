import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
import { NotifService } from './notif.service';
import { NotifController } from './notif.controller';
import { SocketModule } from 'src/sockets/socket.module';

@Module({
  imports: [SocketModule],
  providers: [NotifGateway, NotifService],
  exports: [NotifGateway, NotifService],
  controllers: [NotifController],
})
export class NotifModule {}
