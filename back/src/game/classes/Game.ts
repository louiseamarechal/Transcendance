import { Namespace } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PublicUser } from 'src/user/types';
import Player from './Player';
import Ball from './Ball';

export enum GameStatus {
  Waiting = 'Waiting',
  Ready = 'Ready',
  Timer = 'Timer',
  Playing = 'Playing',
  Done = 'Done',
}

export enum GameVisibility {
  Public = 'Public',
  Private = 'Private',
}

export class Game {
  server: Namespace;

  readonly gameId: string = uuid();
  readonly createdAt: number = Date.now();
  gameStartedAt: number;
  #intervalId: NodeJS.Timer | null = null;

  p1: Player;
  p2: Player;
  ball: Ball;
  score: [number, number] = [0, 0];

  status: GameStatus = GameStatus.Waiting;
  visibility: GameVisibility = GameVisibility.Public;

  constructor(server: Namespace, visibility?: GameVisibility) {
    console.log('[Game] New instance');

    this.p1 = new Player();
    this.p2 = new Player();
    this.ball = new Ball();

    this.server = server;
    if (visibility) {
      this.visibility = visibility;
    }
  }

  debug() {
    console.log({
      id: this.gameId,
      info: [
        this.score,
        this.status,
        this.visibility,
        this.#intervalId ? true : false,
      ],
      p1: this.p1,
      p2: this.p2,
      ball: this.ball,
    });
  }

  async gameLoop() {
    console.log('[Game] gameLoop');

    if (this.status === GameStatus.Ready) {
      this.gameLoopReady();
    } else if (this.status === GameStatus.Timer) {
      this.gameLoopTimer();
    } else if (this.status === GameStatus.Playing) {
      this.gameLoopPlaying();
    }
  }

  startGameLoop(delay: number) {
    console.log('[Game] Start Game Loop');
    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.gameLoop.bind(this), delay);
    }
  }

  stopGameLoop() {
    console.log(
      '[Game] Stop Game Loop',
      this.#intervalId ? 'Clear interval' : null,
    );
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  /**
   * PRIVATE
   */
  private gameLoopReady() {
    console.log('  Ready');

    if (this.p1.ready && this.p2.ready) {
      this.status = GameStatus.Timer;
      this.gameStartedAt = Date.now() + 4000;
      return;
    }

    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'ready',
      data: { p1ready: this.p1.ready, p2ready: this.p2.ready },
    });
  }

  private gameLoopTimer() {
    console.log('  Timer');

    if (Date.now() > this.gameStartedAt) {
      this.status = GameStatus.Playing;
      return;
    }

    console.log(Math.floor((this.gameStartedAt - Date.now()) / 1000));
    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'timer',
      data: { timerval: Math.floor((this.gameStartedAt - Date.now()) / 1000) },
    });
  }

  private gameLoopPlaying() {
    console.log('  Playing');

    this.ball.pos[0] = this.ball.pos[0] + this.ball.velocity[0];

    if (this.ball.pos[0] > 1 || this.ball.pos[0] < 0) {
      this.ball.velocity[0] = this.ball.velocity[0] * -1;
    }

    const overlayData: any = {
      p1name: this.p1.user?.name,
      p2name: this.p2.user?.name,
      score: this.score,
    };
    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'playing',
      data: overlayData,
    });

    const gameData: any = {
      p1: this.p1,
      p2: this.p2,
      ball: this.ball,
    };
    this.server.to(this.gameId).emit('server.game.gameData', {
      data: gameData,
    });
  }
}
