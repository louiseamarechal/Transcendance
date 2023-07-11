import { Server } from 'socket.io';
import { Game } from './Game';

export class GameManager {
  public server: Server;

  private readonly games: Map<string, Game> = new Map<string, Game>()

  /**
   * createGame
   */
  public createGame() {
    
  }
}
