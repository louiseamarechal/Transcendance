import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PublicUser } from 'src/user/types';

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
  server: Server;

  readonly createdAt: number = Date.now();
  gameStartedAt: number;
  readonly gameId: string = uuid();
  P1: PublicUser;
  P1Ready: boolean = false;
  P2: PublicUser;
  P2Ready: boolean = false;

  score: [number, number] = [0, 0];
  status: GameStatus = GameStatus.Waiting;
  visibility: GameVisibility = GameVisibility.Public;

  P1Pos: number = 0.5;
  P2Pos: number = 0.5;
  ballPos: [number, number] = [0.5, 0.5];
  ballVel: [number, number] = [0.1, 0];

  private intervalId: NodeJS.Timer | null = null;

  constructor(server: Server, visibility?: GameVisibility) {
    console.log('[Game] New instance');

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
        this.intervalId ? true : false,
      ],
      pl: [
        [this.P1?.name, this.P1Ready, this.P1Pos],
        [this.P2?.name, this.P2Ready, this.P2Pos],
      ],
      ball: [this.ballPos, this.ballVel],
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
    if (!this.intervalId) {
      this.intervalId = setInterval(this.gameLoop.bind(this), delay);
    }
  }

  stopGameLoop() {
    console.log(
      '[Game] Stop Game Loop',
      this.intervalId ? 'Clear interval' : null,
    );
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * PRIVATE
   */
  private gameLoopReady() {
    console.log('  Ready');

    if (this.P1Ready && this.P2Ready) {
      this.status = GameStatus.Timer;
      this.gameStartedAt = Date.now() + 4000;
      return;
    }

    // this.P1Ready = !this.P1Ready;
    // this.P2Ready = !this.P2Ready;
    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'ready',
      data: { p1ready: this.P1Ready, p2ready: this.P2Ready },
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

    this.server.to(this.gameId).emit('server.game.updateOverlay', {
      type: 'playing',
      data: {},
    });
  }
}
