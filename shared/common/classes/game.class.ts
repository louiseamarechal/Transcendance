import { Vec2D } from "../types/game.type";
import { PublicUser } from "../types/user.type";

export class Ball {
  pos: Vec2D = { x: 0.5, y: 0.5 };
  velocity: Vec2D = { x: 0.01, y: 0 };
  radius: number = 0.05;
}

export class Paddle {
  pos: number = 0.5;
  size: number = 0.1;
  width: number = 0.05;
}

export class Player {
  user: PublicUser;
  ready: boolean = false;
  paddle: Paddle = new Paddle();
}
