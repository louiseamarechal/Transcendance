import { Vec2D } from '../../../../shared/common/types/game.type';

export function distance(a: Vec2D, b: Vec2D): number {
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
