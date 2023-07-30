import { Rect } from 'react-konva';

type GamePaddleProps = {
  x: number;
  y: number;
  size: number;
  paddleWidth: number;
};

export default function GamePaddle({
  x,
  y,
  size,
  paddleWidth,
}: GamePaddleProps) {
  return (
    <Rect
      x={x}
      y={y - size}
      width={paddleWidth}
      height={2 * size}
      fill="black"
      cornerRadius={10}
    />
  );
}
