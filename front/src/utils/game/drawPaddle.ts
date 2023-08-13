export function drawPaddle(ctx: any, canvas: any, x: any, y: any, size: any) {
  console.log(ctx, canvas, x, y, size)

  ctx.beginPath();
  // ctx.roundRect(x, y, width, height, [50]);
  // ctx.fillStyle = colors;
  ctx.lineWidth = 1;
  ctx.fill();
}
