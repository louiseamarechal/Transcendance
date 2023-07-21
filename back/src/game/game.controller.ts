import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';

import { GetUserId } from 'src/common/decorators';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async createGame(@GetUserId() userId: number, @Body() dto: CreateGameDto) {
    console.log('creating game without ID');
    return this.gameService.createGame(userId, dto.toId);
  }

  @Post(':id')
  createFRById(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) toId: number,
  ) {
    return this.gameService.createGame(userId, toId);
  }
}
