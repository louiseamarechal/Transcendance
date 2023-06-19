export default function PaddleHit(ballObj, paddleProps) {
    if (
      ballObj.x < paddleProps.x + paddleProps.width &&
      ballObj.x > paddleProps.x &&
      paddleProps.y < paddleProps.y + paddleProps.height &&
      ballObj.y + ballObj.rad > paddleProps.y - paddleProps.height / 2
    ) {
      // CHECK WHERE THE ballObj HIT THE paddleProps
      let collisionPoint = ballObj.x - (paddleProps.x + paddleProps.width / 2);
  
      // NORMALIZE THE VALUES
      collisionPoint = collisionPoint / (paddleProps.width / 2);
  
      // CALCULATE THE ANGLE OF THE ballObj
      let angle = (collisionPoint * Math.PI) / 3;
  
      ballObj.dx = ballObj.speed * Math.sin(angle);
      ballObj.dy = -ballObj.speed * Math.cos(angle);
    }
  }