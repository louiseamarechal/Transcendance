import { Server, Socket } from 'socket.io';
import { Game, GameStatus, GameVisibility } from './Game';
import { Cron } from '@nestjs/schedule';

export class GameManager {
  public server: Server;

  readonly #games: Map<string, Game> = new Map<string, Game>();

  public joinQueue(client: Socket) {
    console.log('[GameManager] joinQueue');
    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);

    if (filtGames.length === 0) {
      const newGame = new Game(this.server);
      newGame.player1 = client.data.user;
      client.join(newGame.gameId);
      this.addGame(newGame);
    } else {
      const game = filtGames[0];
      game.player2 = client.data.user;
      game.status = GameStatus.Ready;
      client.join(game.gameId);

      this.server
        .to(game.gameId)
        .emit('server.game.navigate', { to: `/gamesocket/${game.gameId}` });
    }
    console.log('[GameManager] joinQueue done');
  }

  public leaveQueue() {
    console.log('[GameManager] leaveQueue');
    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);

    if (filtGames.length > 0) {
      const game = filtGames[0];
      this.removeGame(game);
    }
  }

  public handleInput(gameId: string, playerId: number, val: number) {
    const game = this.#games.get(gameId);
    if (!game) {
      return;
    }

    if (game.player1.id === playerId) {
      game.player1Pos = val
    } else if (game.player2.id === playerId) {
      game.player2Pos = val
    }
    console.log()
  }

  
  /**
   * PRIVATE METHODS
   **/

  private getGames(
    visibility: GameVisibility | null,
    status: GameStatus | null,
  ): Game[] {
    const allGames: Game[] = Array.from(this.#games.values());

    let tmpGames: Game[];
    if (visibility) {
      tmpGames = allGames.filter((v) => v.visibility === visibility);
    } else {
      tmpGames = allGames;
    }

    let resGames: Game[];
    if (status) {
      resGames = tmpGames.filter((v) => v.status === status);
    } else {
      resGames = tmpGames;
    }

    return resGames;
  }

  private getGameById(gameId: string): Game | undefined {
    return this.#games.get(gameId);
  }

  private addGame(game: Game) {
    console.log(`[GameManager] Add ${game.gameId}`);
    this.#games.set(game.gameId, game);
  }

  private removeGame(game: Game) {
    console.log(`[GameManager] Remove ${game.gameId}`);
    this.server.of('/').adapter.rooms.delete(game.gameId);
    game.stopGameLoop();
    this.#games.delete(game.gameId);
  }

  @Cron('*/5 * * * * *')
  private cleaner() {
    console.log('[GameManager] Cleaner', {
      rooms: this.server.of('/').adapter.rooms,
    });

    this.#games.forEach((game: Game) => {
      game.debug()
      if (game.status === GameStatus.Done) {
        this.removeGame(game);
        return;
      }

      const durationMs = Date.now() - game.createdAt;
      if (durationMs > 1000 * 60 * 60) {
        console.log('more than 1h');
        // delete games existing for more than 1h.
        // This should be unnecessary of well coded
      }
    });
  }
}
