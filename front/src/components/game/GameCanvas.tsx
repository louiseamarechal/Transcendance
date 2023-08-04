import { useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import GamePaddle from './GamePaddle';
import GameBall from './GameBall';
import { GameData } from '../../../../shared/server/ServerPayloads';

type GameCanvasProps = GameData;

export default function GameCanvas({ p1, p2, ball }: GameCanvasProps) {
  console.log('Render GameCanvas', ball);
  const parentRef = useRef<HTMLDivElement>(null);

  const width = parentRef.current?.clientWidth;
  const height = parentRef.current?.clientHeight;

  // Left Paddle
  const lx = 0;
  const ly = height && p1 ? p1.paddle.pos * height : 0;
  const lsize = height && p1 ? p1.paddle.size * height : 0;

  // Right Paddle
  const rx = width ? width - 10 : 100;
  const ry = height && p2 ? p2.paddle.pos * height : 0;
  const rsize = height && p2 ? p2.paddle.size * height : 0;

  // Ball
  const bx = width && ball ? ball.pos.x * width : 0;
  const by = height && ball ? ball.pos.y * height : 0;

  return (
    <div ref={parentRef} className="h-[95%] w-[95%]">
      <Stage width={width} height={height}>
        <Layer>
          <GamePaddle x={lx} y={ly} size={lsize} paddleWidth={10} />
          <GamePaddle x={rx} y={ry} size={rsize} paddleWidth={10} />
          <GameBall x={bx} y={by} radius={10} />
        </Layer>
      </Stage>
    </div>
  );
}
