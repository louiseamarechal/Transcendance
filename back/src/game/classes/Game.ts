import { Namespace } from 'socket.io';
import { v4 as uuid } from 'uuid';
import {
  Player,
  Ball,
  Paddle,
} from '../../../../shared/common/classes/game.class';
import { Vec2D } from '../../../../shared/common/types/game.type';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';

export enum GameStatus {
  Waiting = 'Waiting',
  Ready = 'Ready',
  Timer = 'Timer',
  Playing = 'Playing',
  Score = 'Score',
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

  lastBallAcceleration: number;

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

  updatePaddlePos(playerId: number, val: number) {
    if (this.p1.user.id === playerId) {
      const paddle = this.p1.paddle;
      if (val < paddle.size + paddle.deathMargin) {
        this.p1.paddle.pos = paddle.size + paddle.deathMargin;
      } else if (val > 1 - paddle.size - paddle.deathMargin) {
        this.p1.paddle.pos = 1 - paddle.size - paddle.deathMargin;
      } else {
        this.p1.paddle.pos = val;
      }
    } else if (this.p2.user.id === playerId) {
      const paddle = this.p2.paddle;
      if (val < paddle.size + paddle.deathMargin) {
        this.p2.paddle.pos = paddle.size + paddle.deathMargin;
      } else if (val > 1 - paddle.size - paddle.deathMargin) {
        this.p2.paddle.pos = 1 - paddle.size - paddle.deathMargin;
      } else {
        this.p2.paddle.pos = val;
      }
    }
  }

  async gameLoop() {
    // console.log('[Game] gameLoop');

    if (this.status === GameStatus.Ready) {
      this.gameLoopReady();
    } else if (this.status === GameStatus.Timer) {
      this.gameLoopTimer();
    } else if (this.status === GameStatus.Playing) {
      this.gameLoopPlaying();
    } else if (this.status === GameStatus.Score) {
      this.gameLoopScore();
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

  /*****************************************************************************
   *
   *
   ******************************* PRIVATE *************************************
   *
   *
   ****************************************************************************/
  private gameLoopReady() {
    // console.log('  Ready');

    if (this.p1.ready && this.p2.ready) {
      this.status = GameStatus.Timer;
      this.gameStartedAt = Date.now() + 4000;
      return;
    }

    const updateOverlayPayload: ServerPayloads[ServerEvents.updateOverlay] = {
      type: 'ready',
      data: { p1ready: this.p1.ready, p2ready: this.p2.ready },
    };

    this.server
      .to(this.gameId)
      .emit(ServerEvents.updateOverlay, updateOverlayPayload);
  }

  private gameLoopTimer() {
    // console.log('  Timer');

    if (Date.now() > this.gameStartedAt) {
      this.lastBallAcceleration = Date.now();
      this.status = GameStatus.Playing;
      return;
    }

    const updateOverlayPayload: ServerPayloads[ServerEvents.updateOverlay] = {
      type: 'timer',
      data: { timerval: Math.floor((this.gameStartedAt - Date.now()) / 1000) },
    };

    this.server
      .to(this.gameId)
      .emit(ServerEvents.updateOverlay, updateOverlayPayload);
  }

  private gameLoopPlaying() {
    // console.log('  Playing');

    this.computeNextState();

    if (this.isWinCondition() === true) {
      this.status = GameStatus.Score;
    }

    const updateOverlayPayload: ServerPayloads[ServerEvents.updateOverlay] = {
      type: 'playing',
      data: {
        p1name: this.p1.user?.name,
        p2name: this.p2.user?.name,
        score: this.score,
      },
    };

    this.server
      .to(this.gameId)
      .emit(ServerEvents.updateOverlay, updateOverlayPayload);

    const gameData: any = {
      p1: this.p1,
      p2: this.p2,
      ball: this.ball,
    };
    this.server.to(this.gameId).emit(ServerEvents.gameData, gameData);
  }

  private gameLoopScore() {
    this.stopGameLoop();

    const updateOverlayPayload: ServerPayloads[ServerEvents.updateOverlay] = {
      type: 'score',
      data: {
        p1name: this.p1.user?.name,
        p2name: this.p2.user?.name,
        score: this.score,
      },
    };

    this.server
      .to(this.gameId)
      .emit(ServerEvents.updateOverlay, updateOverlayPayload);

    const gameData: any = {
      p1: null,
      p2: null,
      ball: null,
    };
    this.server.to(this.gameId).emit(ServerEvents.gameData, gameData);

    this.status = GameStatus.Done;
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
      const side: 'p1' | 'p2' = this.getSide(newBallPos);
      const intersect = this.getIntersect(prevBallPos, newBallPos, side);
      const bounce = this.isBallBouncingOnPaddle(intersect, side);
      this.updateForOutHorizontally(bounce, intersect, side);
    }

    if (this.isOutVertically(newBallPos)) {
      this.ball.velocity.y *= -1;
    }

    if (
      Date.now() >
      this.lastBallAcceleration + this.ball.velocityIncreaseInterval
    ) {
      this.ball.velocity.x *= 1 + this.ball.velocityIncreaseValue;
      this.ball.velocity.y *= 1 + this.ball.velocityIncreaseValue;
      this.lastBallAcceleration = Date.now();
    }
  }

  /**
   *
   *
   * ComputeNextState Helpers
   *
   *
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

  private isOutVertically(pos: Vec2D) {
    if (pos.y < 0 || pos.y > 1) {
      return true;
    }
    return false;
  }

  private getSide(newBallPos: Vec2D): 'p1' | 'p2' {
    if (newBallPos.x < 0) {
      return 'p1';
    } else if (newBallPos.x > 1) {
      return 'p2';
    }
    throw new Error('Error in getSide()');
  }

  private getIntersect(prev: Vec2D, current: Vec2D, side: 'p1' | 'p2'): Vec2D {
    if (side === 'p2') {
      const xDiff = prev.x - current.x;
      const yDiff = prev.y - current.y;
      const yIntersect = prev.y + ((1 - prev.x) * yDiff) / xDiff;
      return { x: 1, y: yIntersect };
    } else if (side === 'p1') {
      const xDiff = prev.x - current.x;
      const yDiff = prev.y - current.y;
      const yIntersect = prev.y + (prev.x * yDiff) / xDiff;
      return { x: 0, y: yIntersect };
    } else {
      throw new Error(
        `Unintended getIntersect call ! prev=${prev}, current=${current}`,
      );
    }
  }

  private isBallBouncingOnPaddle(intersect: Vec2D, side: 'p1' | 'p2'): boolean {
    let bounce;
    if (side === 'p1') {
      bounce = this.isPaddleIntersectingBall(this.p1.paddle, intersect);
    } else {
      bounce = this.isPaddleIntersectingBall(this.p2.paddle, intersect);
    }
    return bounce;
  }

  private isPaddleIntersectingBall(paddle: Paddle, pos: Vec2D) {
    if (paddle.pos - paddle.size < pos.y && paddle.pos + paddle.size > pos.y) {
      return true;
    }
    return false;
  }

  private updateForOutHorizontally(
    bounce: boolean,
    intersect: Vec2D,
    side: 'p1' | 'p2',
  ) {
    if (bounce) {
      this.ball.velocity.x *= -1;
      this.rotateBallVelocity(side, intersect);
    } else {
      intersect.x === 0 ? this.score[1]++ : this.score[0]++;
      this.ball.pos = { x: 0.5, y: 0.5 };
      this.ball.velocity = { x: 0.01, y: 0 };
      this.lastBallAcceleration = Date.now();
    }
  }

  private rotateBallVelocity(side: 'p1' | 'p2', intersect: Vec2D) {
    const maxAngle = Math.PI / 6;
    const vel = this.ball.velocity;
    let ratio;
    if (side === 'p1') {
      const diffToPaddleCenter = intersect.y - this.p1.paddle.pos;
      ratio = diffToPaddleCenter / this.p1.paddle.size;
    } else {
      const diffToPaddleCenter = this.p2.paddle.pos - intersect.y;
      ratio = diffToPaddleCenter / this.p2.paddle.size;
    }
    const angle = maxAngle * ratio;

    const newVelocity: Vec2D = {
      x: Math.sign(vel.x) * this.normVec2D(vel),
      y: 0,
    };
    console.log({ vel });
    console.log({ newVelocity });

    const rotated = this.rotateVec2D(vel, angle);
    console.log({ rotated, pos: this.ball.pos });
    console.log();

    this.ball.velocity = rotated;
  }

  private rotateVec2D(vec: Vec2D, angle: number): Vec2D {
    return {
      x: vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
      y: vec.x * Math.sin(angle) + vec.y * Math.cos(angle),
    };
  }

  private normVec2D(vec: Vec2D): number {
    return Math.sqrt(vec.x ** 2 + vec.y ** 2);
  }

  private isWinCondition(): boolean {
    if (this.score[0] >= 10 || this.score[1] >= 10) {
      return true;
    }
    return false;
  }
}
