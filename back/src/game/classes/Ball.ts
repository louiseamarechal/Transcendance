import { Vec2D } from '../types';

export default class Ball {
  pos: Vec2D = { x: 0.5, y: 0.5 };
  velocity: Vec2D = { x: 0.02, y: 0 };
  radius: number = 0.05;
}
