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
      newGame.P1 = client.data.user;
      client.join(newGame.gameId);
      this.addGame(newGame);
    } else {
      const game = filtGames[0];
      game.P2 = client.data.user;
      game.status = GameStatus.Ready;
      client.join(game.gameId);

      game.startGameLoop(2000)

      this.server
        .to(game.gameId)
        .emit('server.game.navigate', { to: `/gamesocket/${game.gameId}` });
    }
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

    if (game.P1.id === playerId) {
      game.P1Pos = val;
    } else if (game.P2.id === playerId) {
      game.P2Pos = val;
    }
  }

  public setReady(gameId: string, playerId: number) {
    const game = this.#games.get(gameId);
    if (!game) {
      return;
    }

    if (game.P1.id === playerId) {
      game.P1Ready = true;
    } else if (game.P2.id === playerId) {
      game.P2Ready = true;
    }
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
      game.debug();
      if (game.status === GameStatus.Done) {
        console.log('Remove game. Cause: Game is done');
        this.removeGame(game);
        return;
      }

      if (
        game.status !== GameStatus.Waiting &&
        this.server.of('/').adapter.rooms.get(game.gameId)?.size !== 2
      ) {
        console.log('Remove game. Cause: Room contains only 1 player');
        this.removeGame(game);
        return;
      }

      if (this.server.of('/').adapter.rooms.has(game.gameId) === false) {
        console.log('Remove game. Cause: Room destroyed');
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
