import { Controller, Get, Patch } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators';
import { NotifService } from './notif.service';

@Controller('notif')
export class NotifController {
  constructor(private notifService: NotifService) {}
  @Get('friend')
  getFriendsNotif(@GetUserId() myId: number) {
    return this.notifService.getFriendsNotif(myId);
  }
  @Get('game')
  getGamesNotif(@GetUserId() myId: number) {
    return this.notifService.getGamesNotif(myId);
  }
}
