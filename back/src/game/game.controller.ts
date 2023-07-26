import { Controller, Get, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { GetUserId, Public } from 'src/common/decorators';

@Controller('game')
export class GameController {
  constructor() {}
}
