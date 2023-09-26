import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { GetUserId } from 'src/common/decorators';
import { GameManagerService } from './services/gameManager.service';
import { GameRequest } from '../../../shared/common/types/game.type';
import { GameDbService } from './services/gameDb.service';

@Controller('game')
export class GameController {
  constructor(
    private gameManager: GameManagerService,
    private gameDb: GameDbService,
  ) {}

  // @Post()
  // async createGame(@GetUserId() userId: number, @Body() dto: CreateGameDto) {
  //   console.log('creating game without ID');
  //   return this.gameService.createGame(userId, dto.toId);
  // }

  @Get('myGameRequests')
  getMyGameRequest(@GetUserId() userId: number): GameRequest[] {
    return this.gameManager.getGameRequestById(userId);
  }

  @Get('myGameCreated')
  getMyGameCreated(@GetUserId() userId: number): GameRequest[] {
    return this.gameManager.getGameCreatedById(userId);
  }

  @Get(':id')
  getGamesById(@Param('id', ParseIntPipe) id: number) {
    return this.gameDb.getGamesById(id);
  }

  // @Post(':id')
  // createGameById(
  //   @GetUserId() userId: number,
  //   @Param('id', ParseIntPipe) toId: number,
  // ) {
  //   return this.gameService.createGame(userId, toId);
  // }
}
