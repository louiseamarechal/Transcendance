import { Controller, Get, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { GetUserId, Public } from 'src/common/decorators';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('queue')
  getQueue() {
    return this.gameService.getQueue();
  }

  @Get('join-queue')
  getJoinQueue(@GetUserId() userId: number) {
    return this.gameService.getJoinQueue(userId);
  }

  @Get('leave-queue')
  getLeaveQueue(@GetUserId() userId: number) {
    return this.gameService.getLeaveQueue(userId)
  }
}
