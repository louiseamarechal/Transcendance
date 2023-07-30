import { useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import GamePaddle from './GamePaddle';
import GameBall from './GameBall';

type GameCanvasProps = any;

export default function GameCanvas({ data }: GameCanvasProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const width = parentRef.current?.clientWidth;
  const height = parentRef.current?.clientHeight;

  // Left Paddle
  const lx = 0;
  const ly = height && data.p1 ? data.p1.paddlePos * height : 0;
  const lsize = height && data.p1 ? data.p1.paddleSize * height : 0;

  // Right Paddle
  const rx = width ? width - 10 : 100;
  const ry = height && data.p2 ? data.p2.paddlePos * height : 0;
  const rsize = height && data.p2 ? data.p2.paddleSize * height : 0;

  // Ball
  const bx = width && data.ball ? data.ball.pos[0] * width : 0;
  const by = height && data.ball ? data.ball.pos[1] * height : 0;

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
