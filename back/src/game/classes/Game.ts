import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PublicUser } from 'src/user/types';
import util from 'util';

export enum GameStatus {
  Waiting = 'Waiting',
  Ready = 'Ready',
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
  readonly gameId: string = uuid();
  P1: PublicUser;
  P1Ready: boolean = false
  P2: PublicUser;
  P2Ready: boolean = false

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

  async computeNextState() {
    console.log('[Game] computeNextState');
    if (this.status === GameStatus.Playing) {
      console.log('compute next state of game');
    }
  }

  startGameLoop() {
    console.log('[Game] Start Game Loop');
    if (!this.intervalId) {
      this.intervalId = setInterval(this.computeNextState.bind(this), 1000);
    }
  }

  stopGameLoop() {
    console.log('[Game] Stop Game Loop', this.intervalId);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
