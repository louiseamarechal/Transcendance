import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

enum GameStatus {
  Waiting,
  Ready,
  Playing,
  Done,
}

enum GameVisibility {
  Public,
  Private,
}

export class Game {
  server: Server;

  readonly gameId: string = uuid();
  player1: any;
  player2: any;

  score: [number, number] = [0, 0];
  status: GameStatus = GameStatus.Waiting;
  visibility: GameVisibility = GameVisibility.Public;

  player1Pos: number = 0.5;
  player2Pos: number = 0.5;
  ballPos: [number, number] = [0.5, 0.5];
  ballVel: [number, number] = [0.1, 0];

  constructor(server: Server, visibility?: GameVisibility) {
    this.server = server;
    if (visibility) {
      this.visibility = visibility;
    }

    setInterval(this.computeNextState.bind(this), 1000);
  }

  computeNextState() {
    console.log('computeNextState');
    if (this.status === GameStatus.Playing) {
      console.log('compute next state of game');
    }
  }

  
}
