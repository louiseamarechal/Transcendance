function GameQueue() {
    return (
      <div className="waiting-for-game">
        <h1 className="pong-title">PONG</h1>
        <p>Wait until we find you the perfect match !</p>
        <br />
        <div className="spinner"></div>
      </div>
    );
}

export default GameQueue