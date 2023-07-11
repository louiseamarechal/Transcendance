import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameManager } from './classes/GameManager';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [GameGateway, GameService, GameManager],
  controllers: [GameController]
})
export class GameModule {}
