import { Controller, Get, Patch } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators';
import { NotifService } from './notif.service';

@Controller('notif')
export class NotifController {
  constructor(private notifService: NotifService) {}
  @Get()
  getNotif(@GetUserId() myId: number) {
    return this.notifService.getNotif(myId);
  }
}
