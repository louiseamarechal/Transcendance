export function BallMovement(
  ctx: CanvasRenderingContext2D,
  ballObj: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    rad: number;
    speed?: number;
  },
) {
  const data = new Ball(ballObj.x, ballObj.y, ballObj.rad);
  data.draw(ctx);
  ballObj.x += ballObj.dx;
  ballObj.y += ballObj.dy;
}

class Ball {
  x: number;
  y: number;
  rad: number;

  constructor(x: number, y: number, rad: number) {
    this.x = x;
    this.y = y;
    this.rad = rad;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(29, 29, 27)';
    ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(29, 29, 27)';
    ctx.fill();
    ctx.stroke();
  }
}
