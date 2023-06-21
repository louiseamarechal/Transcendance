import { useEffect, useRef } from 'react';
import { BallMovement } from '../../pong-game/BallMovement';
import data from '../../pong-game/data';
import WallCollision from '../../pong-game/utils/WallCollision';
import Paddle from '../../pong-game/Paddle';
import PaddleHit from '../../pong-game/utils/PaddleHit';
import PlayerStats from '../../pong-game/PlayerStats';
// import ResetBallData from '../../pong-game/utils/ResetBallData';
// import ResetPlayerData from '../../pong-game/utils/ResetPlayerData';
import '../../style/pages/Game/PlayGamePage.css';

const PlayGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const { ballObj, paddleProps, player } = data;

  const players = [
    { name: 'lmarecha', score: 0 },
    { name: 'aalleon', score: 0 },
  ];

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const context: CanvasRenderingContext2D = canvas.getContext('2d');

      // we don't have a y in the paddleProps data
      paddleProps.x = canvas.width - 30;

      context.clearRect(0, 0, canvas.width, canvas.height);

      BallMovement(context, ballObj);

      // if (player.lives === 0) {
      //   alert('Game Over! Press ok to restart');
      //   ResetPlayerData(player);
      //   ResetBallData(ballObj, paddleProps);
      // }

      WallCollision(ballObj, canvas, player, paddleProps);

      Paddle(context, canvas, paddleProps);

      // Padlle and ball collision
      PaddleHit(ballObj, paddleProps);

      // console.log("RequestAnimationFrame(render)");
      requestAnimationFrame(render); // it's calling the fct multiple times (see the console)
    };

    render();
  });

  return (
    <>
      <div className="players-stats">
        {players.map((player, index) => (
          <PlayerStats
            key={index}
            playerName={player.name}
            playerScore={player.score}
          />
        ))}
      </div>
    <div className="play-game-page">
      <div className="background">
        <div className="game-net"></div>
      </div>
      <div className="background">
        <h1>PONG</h1>
      </div>
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseMove={(e) =>
          (paddleProps.y = e.clientY - paddleProps.height / 2 - 10)
        } // adding the paddle width / 2 allow us to have the cursor in the middle of the paddle
        height={
          window.innerHeight < 900
            ? window.innerHeight - 20
            : window.innerHeight - (window.innerHeight * 20) / 100
        }
        width={
          window.innerWidth < 900
            ? window.innerWidth - 20
            : window.innerWidth - (window.innerWidth * 20) / 100
        }
      />
    </div>
    </>
    // </>
  );
};

export default PlayGame;
