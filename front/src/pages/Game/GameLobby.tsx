import { Link } from "react-router-dom";

const GameLobby = () => {
  return (
    <div className="gamepage-container">
      <h1 className="gamepage-title">PONG</h1>
      <div className="net-container">
        <Link to={'/game/wait'}>
          <button className="searchgame-button mr-2">Search Game</button>
        </Link>
        <div className="net"></div>
        <Link to={'/findfriends'}>
          <button className="searchgame-button m1-2">Invite Friends</button>
        </Link>
      </div>
    </div>
  );
};

export default GameLobby;
