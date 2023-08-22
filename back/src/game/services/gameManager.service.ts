import { Socket, Namespace } from 'socket.io';
import { Game, GameStatus, GameVisibility } from '../classes/Game';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { GameDbService } from './gameDb.service';
import { UserService } from 'src/user/user.service';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { PublicUser } from '../../../../shared/common/types/user.type';
import { GameRequest } from '../../../../shared/common/types/game.type';
import { ServerEvents } from '../../../../shared/server/ServerEvents';

@Injectable()
export class GameManagerService {
  public server: Namespace;
  readonly #games: Map<string, Game> = new Map<string, Game>();

  constructor(
    private gameDb: GameDbService,
    private userService: UserService,
  ) {}

  public joinQueue(client: Socket) {
    console.log('[GameManager] joinQueue');
    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);

    filtGames.forEach((game) => console.log({ uuid: game.gameId }));
    if (filtGames.length === 0) {
      console.log('[GameManager] joinQueue > No games');
      const newGame = new Game(this.server);
      newGame.p1.user = client.data.user;
      client.join(newGame.gameId);
      this.addGame(newGame);
    } else if (filtGames[0].p1.user.id !== client.data.user.id) {
      console.log('[GameManager] joinQueue > Found game');
      const game = filtGames[0];
      game.p2.user = client.data.user;
      game.status = GameStatus.Ready;
      client.join(game.gameId);

      game.startGameLoop(20);

      this.server
        .to(game.gameId)
        .emit('server.game.navigate', { to: `/game/${game.gameId}` });
    } else {
      console.log('[GameManager] joinQueue > Nothing to do here');
    }
  }

  public leaveQueue(client: Socket) {
    console.log('[GameManager] leaveQueue');
    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);

    filtGames.forEach((game) => {
      if (game.p1.user.id === client.data.user.id) {
        this.removeGame(game);
      }
    });
  }

  public handleInput(playerId: number, gameId: string, val: number) {
    const game = this.#games.get(gameId);
    if (!game) {
      return;
    }

    game.updatePaddlePos(playerId, val);
  }

  public setReady(playerId: number, gameId: string) {
    const game = this.#games.get(gameId);
    if (!game) {
      return;
    }

    if (game.p1.user.id === playerId) {
      game.p1.ready = true;
    } else if (game.p2.user.id === playerId) {
      game.p2.ready = true;
    }

    if (game.p1.ready && game.p2.ready) {
      // this.userService.editUser(game.p1.user.id, {});
    }
  }

  public async createPrivateGame(client: Socket, p1Id: number, p2Id: number) {
    const newGame = new Game(this.server);
    newGame.visibility = GameVisibility.Private;
    const p1: PublicUser = await this.userService.getUserById(p1Id);
    const p2: PublicUser = await this.userService.getUserById(p2Id);
    newGame.p1.user = p1;
    newGame.p2.user = p2;
    client.join(newGame.gameId);
    this.addGame(newGame);
    // SEND NOTIF
  }

  public getGameRequestById(id: number): GameRequest[] {
    return Array.from(this.#games.values())
      .filter((game) => game.visibility === GameVisibility.Private)
      .filter((game) => game.status === GameStatus.Waiting)
      .filter((game) => game.p2.user.id === id)
      .map((game) => {
        return {
          gameId: game.gameId,
          p1: game.p1.user,
          p2: game.p2.user,
        };
      });
  }

  public ping(userId: number) {
    const game = Array.from(this.#games.values())
      .filter((g) => g.status === GameStatus.Playing)
      .filter((g) => g.p1.user.id === userId || g.p2.user.id === userId);

    if (game.length !== 0) {
      if (game[0].p1.user.id === userId) {
        game[0].p1.lastPing = Date.now();
      } else if (game[0].p2.user.id === userId) {
        game[0].p2.lastPing = Date.now();
      }
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

  private async addGame(game: Game) {
    console.log(`[GameManager] addGame ${game.gameId}`);
    this.#games.set(game.gameId, game);
    this.gameDb.createGame(game);
  }

  private async removeGame(game: Game) {
    console.log(`[GameManager] removeGame ${game.gameId}`);
    this.server.adapter.rooms.delete(game.gameId);
    game.stopGameLoop();
    if (game.status !== GameStatus.Done) {
      this.gameDb.deleteGame(game);
    }
    this.#games.delete(game.gameId);
  }

  @Cron('*/1 * * * * *')
  private cleaner() {
    // console.log('[GameManager] Cleaner')
    this.#games.forEach((game: Game) => {
      // game.debug();
      if (game.status === GameStatus.Done) {
        console.log('Remove game. Cause: Game is done');
        this.gameDb.updateGame(game);
        this.removeGame(game);
        return;
      }

      const now = Date.now();
      if (
        game.status === GameStatus.Playing &&
        (now - game.p1.lastPing > 3000 || now - game.p2.lastPing > 3000)
      ) {
        console.log('Remove game. Cause: No ping for 3secs while playing');
        this.server.to(game.gameId).emit(ServerEvents.gameAbort);
        this.removeGame(game);
        return;
      }

      if (
        game.status !== GameStatus.Waiting &&
        this.server.adapter.rooms.get(game.gameId)?.size !== 2
      ) {
        console.log('Remove game. Cause: Room contains only 1 player');
        this.server.to(game.gameId).emit(ServerEvents.gameAbort);
        this.removeGame(game);
        return;
      }

      if (this.server.adapter.rooms.has(game.gameId) === false) {
        console.log('Remove game. Cause: Room destroyed');
        this.server.to(game.gameId).emit(ServerEvents.gameAbort);
        this.removeGame(game);
        return;
      }

      const durationMs = Date.now() - game.createdAt;
      if (durationMs > 1000 * 60 * 30) {
        console.log('Remove game. Cause: Existing for more than 30mins');
        this.server.to(game.gameId).emit(ServerEvents.gameAbort);
        this.removeGame(game);
        // This should be unnecessary of well coded
      }
    });
  }
}
