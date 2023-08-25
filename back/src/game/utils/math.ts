import { Vec2D } from '../../../../shared/common/types/game.type';

export function distance(a: Vec2D, b: Vec2D): number {
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

export function rotateVec2D(vec: Vec2D, angle: number): Vec2D {
  return {
    x: vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
    y: vec.x * Math.sin(angle) + vec.y * Math.cos(angle),
  };
}

export function normVec2D(vec: Vec2D): number {
  return Math.sqrt(vec.x ** 2 + vec.y ** 2);
}
