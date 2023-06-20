import '../../style/pages/game/FoundGamePage.css'

const FoundGamePage = () => {
  return (
    <div className="found-game h-screen flex flex-col items-center justify-center">
      <h1>PONG</h1>
      <p>username wants to play with you</p>
      <div className="game-choice">
        <button className="play-game-button-bg flex justify-center items-center">
          <div className="play-game-triangle"></div>
        </button>
        <button className="decline-game-bg">X</button>
      </div>
    </div>
  );
};

export default FoundGamePage;
