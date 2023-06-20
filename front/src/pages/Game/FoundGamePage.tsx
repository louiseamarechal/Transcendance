const FoundGamePage = () => {
  return (
    <div>
      <h1>PONG</h1>
      <p>username wants to play with you</p>
      <div className="game-choice">
        <button className="play-game-button flex justify-center items-center">
          <div className="play-game-triangle"></div>
        </button>
        <button className="decline-game">X</button>
      </div>
    </div>
  );
};

export default FoundGamePage;
