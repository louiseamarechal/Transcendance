import { useEffect, useRef } from 'react';

type GameCanvasProps = any;

function GameCanvas(props: GameCanvasProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const context = canvas?.getContext('2d');

  useEffect(() => {
    if (context && canvas) {
      const widht = canvas.width;
      const height = canvas.height;

      context.clearRect(0, 0, widht, height)
      // context.fillStyle = '#000000';
      // context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      // context.fillStyle = '#000000';
      // context.beginPath();
      // context.arc(0, 0, 5, 0, 2 * Math.PI);
      // context.fill();

      context.beginPath();
      context.roundRect(10, height / 4, widht / 100, height / 10, [50]);
      context.fillStyle = '#000000';
      context.lineWidth = 1;
      context.fill();
    }
  }, [props]);

  return (
    <div ref={parentRef} className="h-[95%] w-[95%]">
      <canvas
        ref={canvasRef}
        width={parentRef.current?.clientWidth}
        height={parentRef.current?.clientHeight}
        id="canvas"
      ></canvas>
    </div>
  );
}

export default GameCanvas;
