import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { PublicUser } from 'src/user/types';

export enum GameStatus {
  Waiting,
  Ready,
  Playing,
  Done,
}

export enum GameVisibility {
  Public,
  Private,
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

  constructor(server: Server, visibility?: GameVisibility) {
    console.log('New instance of Game');

    this.server = server;
    if (visibility) {
      this.visibility = visibility;
    }

    setInterval(this.computeNextState.bind(this), 1000);
  }

  async computeNextState() {
    console.log('computeNextState', {player1: this.player1?.name, player2: this.player2?.name});
    if (this.status === GameStatus.Playing) {
      console.log('compute next state of game');
    }
  }
}
