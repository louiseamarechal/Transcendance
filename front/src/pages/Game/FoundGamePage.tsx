import { Link } from 'react-router-dom';
import '../../style/pages/game/FoundGamePage.css';

const FoundGamePage = () => {
  return (
    <div className="found-game h-screen flex flex-col items-center justify-center flex-wrap">
      <h1>PONG</h1>
      <p>username wants to play with you</p>
      <div className="game-choice">
        <Link to="/playgame">
          <button className="play-game-button-bg flex justify-center items-center">
            <div className="play-game-triangle"></div>
          </button>
        </Link>
        <Link to="/game">
          <button className="decline-game-bg">X</button>
        </Link>
      </div>
    </div>
  );
};

export default FoundGamePage;
