export default function ResetBallData(
  ballObj: { x: number; y: number; dx: number; dy: number },
  paddleProps: { x: number; y: number },
) {
  ballObj.x = paddleProps.x;
  ballObj.y = paddleProps.y - 80;
  ballObj.dx = 6 * (Math.random() * 2 - 1);
  ballObj.dy = -6;
}
