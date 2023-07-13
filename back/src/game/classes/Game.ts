import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PublicUser } from 'src/user/types';

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

  readonly gameId: string = uuid();
  player1: PublicUser;
  player2: PublicUser;

  score: [number, number] = [0, 0];
  status: GameStatus = GameStatus.Waiting;
  visibility: GameVisibility = GameVisibility.Public;

  player1Pos: number = 0.5;
  player2Pos: number = 0.5;
  ballPos: [number, number] = [0.5, 0.5];
  ballVel: [number, number] = [0.1, 0];

  private intervalId: NodeJS.Timer | null = null;

  constructor(server: Server, visibility?: GameVisibility) {
    console.log('New instance of Game');

    this.server = server;
    if (visibility) {
      this.visibility = visibility;
    }
  }

  async computeNextState() {
    console.log('computeNextState');
    if (this.status === GameStatus.Playing) {
      console.log('compute next state of game');
    }
  }

  startGameLoop() {
    if (!this.intervalId) {
      this.intervalId = setInterval(this.computeNextState.bind(this), 1000);
    }
  }

  stopGameLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
