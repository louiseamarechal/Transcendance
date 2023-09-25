import { Socket, Namespace } from 'socket.io';
import { Game, GameStatus, GameVisibility } from '../classes/Game';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { GameDbService } from './gameDb.service';
import { UserService } from 'src/user/user.service';
import { PublicUser } from '../../../../shared/common/types/user.type';
import { GameRequest } from '../../../../shared/common/types/game.type';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { getGameByUserId } from '../utils/game.utils';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { AchievementDbService } from './AchievementDb.service';

@Injectable()
export class GameManagerService {
  public server: Namespace;
  #games: Map<string, Game> = new Map<string, Game>();

  constructor(
    private gameDb: GameDbService,
    private userService: UserService,
    private achievementDb: AchievementDbService,
  ) {}

  public joinQueue(client: Socket) {
    console.log('[GameManager] joinQueue');
    const userId = client.data.user.id;

    // Check if already in a game
    const userGame: Game | null = getGameByUserId(this.#games, userId);
    if (userGame) {
      console.log('[GameManager] joinQueue > User already in a game');
      return;
    }

    const filtGames = this.getGames(GameVisibility.Public, GameStatus.Waiting);
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
      this.userService.editUser(game.p1.user.id, { status: 'PLAYING' });
    }
  }

  public async createPrivateGame(
    client: Socket,
    payload: ClientPayloads[ClientEvents.GameCreateGame],
  ) {
    // Check if already in a game
    const userGame: Game | null = getGameByUserId(this.#games, payload.p1Id);
    if (userGame) {
      console.log('[GameManager] createPrivateGame > User already in a game');
      client.emit(ServerEvents.privateGameNotCreated, {
        why: 'Failed ! You are already in a game.',
      });
      return;
    }

    const newGame = new Game(this.server);
    newGame.visibility = GameVisibility.Private;
    const p1: PublicUser = await this.userService.getUserById(payload.p1Id);
    const p2: PublicUser = await this.userService.getUserById(payload.p2Id);
    newGame.p1.user = p1;
    newGame.p2.user = p2;
    newGame.p1.paddle.size = Number(payload.p1PaddleSize);
    newGame.p2.paddle.size = Number(payload.p2PaddleSize);

    client.join(newGame.gameId);
    this.addGame(newGame);

    this.server.to(newGame.gameId).emit(ServerEvents.privateGameCreated);
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

  public acceptGameRequest(client: Socket, gameId: string) {
    const game = this.#games.get(gameId);
    if (!game) return;
    if (game.status !== GameStatus.Waiting) return;

    game.p2.user = client.data.user;
    game.status = GameStatus.Ready;
    client.join(game.gameId);

    game.startGameLoop(20);

    this.server
      .to(game.gameId)
      .emit(ServerEvents.gameNavigate, { to: `/game/${game.gameId}` });
  }

  public refuseGameRequest(client: Socket, gameId: string) {
    const game = this.#games.get(gameId);
    if (!game) return;
    if (game.status !== GameStatus.Waiting) return;

    this.server.to(game.gameId).emit(ServerEvents.gameRefused);
    this.removeGame(game);
  }

  public ping(userId: number) {
    const game = Array.from(this.#games.values())
      .filter(
        (g) =>
          g.status === GameStatus.Ready ||
          g.status === GameStatus.Timer ||
          g.status === GameStatus.Playing,
      )
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
    // this.gameDb.createGame(game);
  }

  private async removeGame(game: Game) {
    console.log(`[GameManager] removeGame ${game.gameId}`);
    this.server.adapter.rooms.delete(game.gameId);
    game.stopGameLoop();
    // if (game.status !== GameStatus.Done) {
    //   this.gameDb.deleteGame(game);
    // }
    this.#games.delete(game.gameId);
  }

  @Cron('*/1 * * * * *')
  private cleaner() {
    // console.log('[GameManager] Cleaner')
    this.#games.forEach((game: Game) => {
      game.debug();
      if (this.checkGameDone(game)) return;
      if (this.checkGameNoPing(game)) return;
      if (this.checkGameDisconnection(game)) return;
      if (this.checkGameDestoyed(game)) return;
      if (this.checkGameTooLong(game)) return;
    });
  }

  private checkGameDone(game: Game): boolean {
    if (game.status === GameStatus.Done) {
      console.log('Remove game. Cause: Game is done');
      this.gameDb.writeToDb(game).then(() => {
        this.achievementDb.writeAchievementToDb(game);
        this.removeGame(game);
      })
      // this.gameDb.writeAchievementToDb(game);
      return true;
    }
    return false;
  }

  private checkGameNoPing(game: Game): boolean {
    const isPlaying =
      game.status === GameStatus.Ready ||
      game.status === GameStatus.Timer ||
      game.status === GameStatus.Playing;
    const now = Date.now();
    const isP1NoPing = now - game.p1.lastPing > 3000;
    const isP2NoPing = now - game.p2.lastPing > 3000;
    if (isPlaying && (isP1NoPing || isP2NoPing)) {
      console.log(
        'Remove game. Cause: No ping for 3secs while ready, timer or playing',
      );
      this.server.to(game.gameId).emit(ServerEvents.gameAbort);
      this.removeGame(game);
      return true;
    }
    return false;
  }

  private checkGameDisconnection(game: Game): boolean {
    const isNotWaiting = game.status !== GameStatus.Waiting;
    const hasNotTwoSocket =
      this.server.adapter.rooms.get(game.gameId)?.size !== 2;

    if (isNotWaiting && hasNotTwoSocket) {
      console.log('Remove game. Cause: Room contains only 1 player');
      this.server.to(game.gameId).emit(ServerEvents.gameAbort);
      this.removeGame(game);
      return true;
    }
    return false;
  }

  private checkGameDestoyed(game: Game): boolean {
    if (this.server.adapter.rooms.has(game.gameId) === false) {
      console.log('Remove game. Cause: Room destroyed');
      this.server.to(game.gameId).emit(ServerEvents.gameAbort);
      this.removeGame(game);
      return true;
    }
    return false;
  }

  private checkGameTooLong(game: Game): boolean {
    const durationMs = Date.now() - game.createdAt;
    if (durationMs > 1000 * 60 * 30) {
      console.log('Remove game. Cause: Existing for more than 30mins');
      this.server.to(game.gameId).emit(ServerEvents.gameAbort);
      this.removeGame(game);
      // This should be unnecessary of well coded
      return true;
    }
    return false;
  }
}
