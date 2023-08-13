export function drawPaddle(ctx: any, canvas: any, x: any, y: any, radius: any) {
  console.log(ctx, canvas, x, y, radius);
  
  ctx.beginPath();
  ctx.fillStyle = 'rgba(29, 29, 27)';
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(29, 29, 27)';
  ctx.fill();
  ctx.stroke();
}
