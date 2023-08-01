import { Namespace } from 'socket.io';
import { v4 as uuid } from 'uuid';
import Player from './Player';
import Ball from './Ball';
import { Vec2D } from '../types';

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
    // console.log('[Game] gameLoop');

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
    console.log('[Game] Stop Game Loop');
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  /**
   * PRIVATE
   */
  private gameLoopReady() {
    // console.log('  Ready');

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
    // console.log('  Timer');

    if (Date.now() > this.gameStartedAt) {
      this.status = GameStatus.Playing;
      return;
    }

    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'timer',
      data: { timerval: Math.floor((this.gameStartedAt - Date.now()) / 1000) },
    });
  }

  private gameLoopPlaying() {
    // console.log('  Playing');

    this.computeNextState();

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

  private computeNextState() {
    const prevBallPos: Vec2D = { ...this.ball.pos };
    const newBallPos: Vec2D = {
      x: this.ball.pos.x + this.ball.velocity.x,
      y: this.ball.pos.y + this.ball.velocity.y,
    };

    if (this.isOut(newBallPos) === false) {
      this.ball.pos = newBallPos;
      return;
    }

    if (this.isOutHorizontally(newBallPos)) {
      this.ball.velocity.x *= -1;
    }
  }

  /**
   * ComputeNextState Helpers
   */
  private isOut(pos: Vec2D) {
    if (pos.x > 0 && pos.x < 1 && pos.y > 0 && pos.y < 1) {
      return false;
    }
    return true;
  }

  private isOutHorizontally(pos: Vec2D) {
    if (pos.x < 0 || pos.x > 1) {
      return true;
    }
    return false;
  }

  private isPaddleIntersectingBall(
    paddlePos: number,
    paddleSize: number,
    pos: Vec2D,
  ) {}

  private rotateVec2D(vec: Vec2D, angle: number) {}
}
