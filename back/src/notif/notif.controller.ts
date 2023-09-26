import { Controller, Get } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators';
import { NotifService } from './notif.service';
import { FriendRequest } from '@prisma/client';
import { GameSchema } from '../../../shared/common/types/game.type';

@Controller('notif')
export class NotifController {
  constructor(private notifService: NotifService) {}

  @Get('friend')
  getFriendsNotif(@GetUserId() myId: number): Promise<FriendRequest[]> {
    return this.notifService.getFriendsNotif(myId);
  }

  @Get('game')
  getGamesNotif(@GetUserId() myId: number): Promise<GameSchema[]> {
    return this.notifService.getGamesNotif(myId);
  }
}
