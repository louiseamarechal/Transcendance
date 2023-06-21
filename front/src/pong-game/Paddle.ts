export default (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  paddleProps: { y: number; height: number; width: number; x: number },
) => {
  class Paddle {
    x: number;
    y: number;
    height: number;
    width: number;
    colors: string;

    constructor(x: number) {
      this.x = x;
      this.y = paddleProps.y;
      this.height = paddleProps.height;
      this.width = paddleProps.width;
      this.colors = 'rgba(29, 29, 27)'; // equal to our var(--black)
    }
    move() {
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width, this.height, [50]);
      ctx.fillStyle = this.colors;
      ctx.lineWidth = 1;
      ctx.fill();
    }
  }

  const paddle = new Paddle(paddleProps.x);
  paddle.move();
  if (paddleProps.y <= 0) {
    paddleProps.y = 0;
  } else if (paddleProps.y + paddleProps.height >= canvas.height) {
    paddleProps.y = canvas.height - paddleProps.height;
  }
};
