import { PublicUser } from 'src/user/types';

export default class Player {
  user: PublicUser;
  ready: boolean = false;
  paddlePos: number = 0.5;
  paddleSize: number = 0.1;
}
