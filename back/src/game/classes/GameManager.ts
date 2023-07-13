import { Server, Socket } from 'socket.io';
import { Game, GameStatus, GameVisibility } from './Game';
import { Cron } from '@nestjs/schedule';

export class GameManager {
  public server: Server;

  readonly #games: Map<string, Game> = new Map<string, Game>();

  // public searchGame(client: Socket) {
  //   const waitingPublicGames = this.getWaitingPublicGames();

  //   if (waitingPublicGames.length === 0) {
  //     const newGame = new Game(this.server);
  //     newGame.player1 = client.data.user;
  //     client.join(newGame.gameId);
  //     this.addGame(newGame);
  //     // this.games.set(newGame.gameId, newGame);
  //     // this.server
  //     //   .to(newGame.gameId)
  //     //   .emit('server.game.navigate', { to: `/gamesocket/queue` });
  //   } else {
  //     const game = waitingPublicGames[0];
  //     game.player2 = client.data.user;
  //     client.join(game.gameId);

  //     this.server
  //       .to(game.gameId)
  //       .emit('server.game.navigate', { to: `/gamesocket/${game.gameId}` });
  //   }

  // }

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

  public leaveQueue(client: Socket) {
    console.log('[GameManager] leaveQueue');
    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);

    if (filtGames.length > 0) {
      const game = filtGames[0];
      this.removeGame(game);
    }
  }

  /**
   * cancelGame
   */
  public cancelGame(userId: number) {
    console.log('In cancelGame');
    let gameId: string;
    let game: Game;
    for ([gameId, game] of this.#games) {
      if (userId === game.player1.id) {
        game.stopGameLoop();
        game.status = GameStatus.Done;
        this.server
          .to(gameId)
          .emit('server.game.navigate', { to: '/gamesocket' });
      }
    }
  }

  /**
   * PRIVATE METHODS
   **/

  // private getWaitingPublicGames() {
  //   const waitingPublicGames: Game[] = [];

  //   this.#games.forEach((game: Game) => {
  //     if (
  //       game.visibility === GameVisibility.Public &&
  //       game.status === GameStatus.Waiting
  //     ) {
  //       waitingPublicGames.push(game);
  //     }
  //   });

  //   return waitingPublicGames;
  // }

  private getGames(
    visibility: GameVisibility | null,
    status: GameStatus | null,
  ) {
    const tmpGames: Game[] = [];
    const returnedGames: Game[] = [];

    if (visibility) {
      this.#games.forEach((game: Game) => {
        if (game.visibility === visibility) {
          tmpGames.push(game);
        }
      });
    } else {
      tmpGames.push(...this.#games.values());
    }

    if (status) {
      tmpGames.forEach((game: Game) => {
        if (game.status === status) {
          returnedGames.push(game);
        }
      });
    } else {
      returnedGames.push(...tmpGames);
    }

    return returnedGames;
  }

  private addGame(game: Game) {
    console.log(`[GameManager] Add ${game.gameId}`);
    this.#games.set(game.gameId, game);
  }

  private removeGame(game: Game) {
    console.log(`[GameManager] Remove ${game.gameId}`);
    game.stopGameLoop();
    this.server.of('/').adapter.rooms.delete(game.gameId);
    this.#games.delete(game.gameId);
  }

  @Cron('*/5 * * * * *')
  private cleaner() {
    console.log('[GameManager] Cleaner', {
      rooms: this.server.of('/').adapter.rooms,
    });

    this.#games.forEach((game: Game) => {
      console.log({
        player1: game.player1?.name,
        player2: game.player2?.name,
        status: game.status,
      });
      if (game.status === GameStatus.Done) {
        this.removeGame(game);
      }
    });
  }
}
