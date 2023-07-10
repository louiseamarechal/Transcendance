import { Body, Controller, Post } from '@nestjs/common';

import { GetUser, GetUserId } from 'src/common/decorators';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async createGame(@GetUserId() userId: number, @Body() dto: CreateGameDto) {
    return this.gameService.createGame(userId, dto.toId);
  }
}
