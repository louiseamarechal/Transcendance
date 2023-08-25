import { Circle } from 'react-konva';

type GameBallProps = {
  x: number;
  y: number;
  radius: number;
};

export default function GameBall({ x, y, radius }: GameBallProps) {
  return <Circle x={x} y={y} radius={radius} fill='black' />;
}
