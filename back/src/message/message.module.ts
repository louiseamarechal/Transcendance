import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { NotifModule } from 'src/notif/notif.module';

@Module({
  imports: [NotifModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
