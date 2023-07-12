import { Server, Socket } from 'socket.io';
import { Game, GameStatus, GameVisibility } from './Game';

export class GameManager {
  public server: Server;

  private readonly games: Map<string, Game> = new Map<string, Game>();

  /**
   * createGame
   */
  public createGame() {}

  /**
   * joinOrCreateGame
   */
  public joinOrCreatePublicGame() {}

  /**
   * searchGame
   */
  public searchGame(client: Socket) {
    const waitingPublicGames = this.getWaitingPublicGames();
    console.log({ waitingPublicGames });

    let returnData: string;

    if (waitingPublicGames.length === 0) {
      const newGame = new Game(this.server);
      newGame.player1 = client.data.user;
      client.join(newGame.gameId);
      this.games.set(newGame.gameId, newGame);
      returnData = 'gameCreated';
    } else {
      const game = waitingPublicGames[0];
      game.player2 = client.data.user;
      client.join(game.gameId);
      returnData = 'joinGame';

      this.server.to(game.gameId).emit('server.game.navigateGame', { id: game.gameId });
    }
    

    return returnData;
    // return {
    //   event: 'server.game.searchgame',
    //   data: returnData,
    // };
  }

  private getGameById(id: string) {
    let gameId: string;
    let game: Game;
    for ([gameId, game] of this.games) {
      if (id === gameId) {
        return game;
      }
    }
    return null;
  }

  private getWaitingPublicGames() {
    let id: string;
    let game: Game;
    const waitingPublicGames: Game[] = [];

    for ([id, game] of this.games) {
      if (
        game.visibility === GameVisibility.Public &&
        game.status === GameStatus.Waiting
      ) {
        waitingPublicGames.push(game);
      }
    }
    return waitingPublicGames;
  }
}
