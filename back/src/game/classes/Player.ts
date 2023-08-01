import { PublicUser } from 'src/user/types';

export class Paddle {
  pos: number = 0.5;
  size: number = 0.1;
  width: number = 0.05;
}

export default class Player {
  user: PublicUser;
  ready: boolean = false;
  paddle: Paddle = new Paddle;
}
