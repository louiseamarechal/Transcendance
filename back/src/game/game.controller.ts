import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators';
import { GameManagerService } from './services/gameManager.service';
import {
  GameRequest,
  GameSchema,
} from '../../../shared/common/types/game.type';
import { GameDbService } from './services/gameDb.service';

@Controller('game')
export class GameController {
  constructor(
    private gameManager: GameManagerService,
    private gameDb: GameDbService,
  ) {}

  @Get('myGameRequests')
  getMyGameRequest(@GetUserId() userId: number): GameRequest[] {
    return this.gameManager.getGameRequestById(userId);
  }

  @Get('myGameCreated')
  getMyGameCreated(@GetUserId() userId: number): GameRequest[] {
    return this.gameManager.getGameCreatedById(userId);
  }

  @Get(':id')
  getGamesById(@Param('id', ParseIntPipe) id: number): Promise<GameSchema[]> {
    return this.gameDb.getGamesById(id);
  }
}
