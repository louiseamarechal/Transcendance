import { useEffect, useRef } from "react";
import { BallMovement } from "../game/BallMovement";
import data from "../game/data";
import WallCollision from "../game/utils/WallCollision";
import Paddle from "../game/Paddle";
import Brick from "../game/Brick";
import BrickCollision from "../game/utils/BrickCollision";
import PaddleHit from "../game/utils/PaddleHit";
import PlayerStats from "../game/PlayerStats";
import ResetBallData from "../game/utils/ResetBallData";
import AllBroken from "../game/utils/AllBroken";
import ResetPlayerData from "../game/utils/ResetPlayerData";
import './style/Gamepage.css'

let bricks = [];

export default function Game() {
  const canvasRef = useRef();
  const { ballObj, paddleProps, player, brickObj } = data;

  // this.canvas = <HTMLCanvasElement>document.createElement('canvas');
  // this.ctx = this.canvas.getContext("2d");
  // this.canvas.width = 500;
  // this.canvas.height = 500;
  
  // document.body.appendChild(this.canvas);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");

      // we don't have a y in the paddleProps data
      paddleProps.y = canvas.height - 30;

      // Asign bricks
      let newBrickSet = Brick(player.level, bricks, canvas, brickObj);

      // we handle the case where newBrickSet is undefined or empty
      if (newBrickSet && newBrickSet.length > 0) {
        bricks = newBrickSet;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      PlayerStats(context, player, canvas);

      // Display the bricks
      bricks.map((brick) => {
        return brick.draw(context);
      });

      BallMovement(context, ballObj);

      AllBroken(bricks, player, ballObj);

      if (player.lives === 0) {
        alert("Game Over! Press ok to restart");
        ResetPlayerData(player);
        ResetBallData(ballObj, paddleProps);
        bricks.length = 0; // reinitialise l'[]
      }

      WallCollision(ballObj, canvas, player, paddleProps);

      let brickCollision;

      for (let i = 0; i < bricks.length; i++) {
        brickCollision = BrickCollision(ballObj, bricks[i]);

        // if we hit the brick and it is not broke we change the direction of the ball and the remove the brock (broke = true)
        if (brickCollision.hit && !bricks[i].broke) {
          // console.log(brickCollision);
          if (brickCollision.axis === "X") {
            ballObj.dx *= -1;
            bricks[i].broke = true;
          } else if (brickCollision.axis === "Y") {
            ballObj.dy *= -1;
            bricks[i].broke = true;
          }
          player.score += 10;
        }
      }
      Paddle(context, canvas, paddleProps);

      // Padlle and ball collision
      PaddleHit(ballObj, paddleProps);

      // console.log("RequestAnimationFrame(render)");
      requestAnimationFrame(render); // it's calling the fct multiple times (see the console)
    };

    render();

  }, []);

  return (
    <div className="game-page">
      <canvas
        id="canvas"
        ref={canvasRef}
        // onMouseMove={(e) => paddleProps.x = e.clientX} // cursor here is on the left of the paddle
        onMouseMove={(e) =>
          (paddleProps.x = e.clientX - paddleProps.width / 2 - 10)
        } // adding the paddle width / 2 allow us to have the cursor in the middle of the paddle
        height="500"
        width={
          window.innerWidth < 900
            ? window.innerWidth - 20
            : window.innerWidth - (window.innerWidth * 20) / 100
        }
      />
    </div>
  );
}
