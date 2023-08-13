import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function GameLobby() {
  const [mode, setMode] = useState<string>('timed');
  const navigate = useNavigate();

  const handleSearchGame = async () => {
    navigate('/game/queue');
  };

  return (
    <div className="gamepage-container">
      <div className="text-9xl text-red-900">Test</div>
      <h1 className="gamepage-title">PONG</h1>
      <div className="net-container">
        <button className="searchgame-button mr-2" onClick={handleSearchGame}>
          Search Game
        </button>
        <Link to={'/game/search'}>
          <div className="searchgame-button mr-2">Search game</div>
        </Link>
        <div className="net"></div>
        <button className="searchgame-button m1-2">Invite Friends</button>
        <Link to={'/game/create'}>
          <div className="searchgame-button mr-2">Create game</div>
        </Link>
      </div>
    </div>
  );
}
