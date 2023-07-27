import { Link } from "react-router-dom";

const OldGameLobby = () => {
  return (
    <div className="gamepage-container">
      <h1 className="gamepage-title">PONG</h1>
      <div className="net-container">
        <Link to={'/oldgame/oldwait'}>
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

export default OldGameLobby;
