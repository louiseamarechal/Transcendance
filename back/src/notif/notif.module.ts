import { Module } from '@nestjs/common';
import { NotifGateway } from './notif.gateway';
import { NotifService } from './notif.service';
import { NotifController } from './notif.controller';
import { SocketModule } from 'src/sockets/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [SocketModule, ScheduleModule.forRoot()],
  providers: [NotifGateway, NotifService, UserService],
  exports: [NotifService],
  controllers: [NotifController],
})
export class NotifModule {}
