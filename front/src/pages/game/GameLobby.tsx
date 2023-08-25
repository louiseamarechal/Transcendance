import { Link } from 'react-router-dom';
import GameLobbyGR from '../../components/game/GameLobby/GameLobbyGR';

export default function GameLobby() {
  return (
    <div className="gamepage-container">
      <h1 className="gamepage-title">PONG</h1>

      <GameLobbyGR />

      <div className="net-container">
        <Link to={'/game/search'}>
          <div className="searchgame-button mr-2">Search game</div>
        </Link>

        <div className="net"></div>

        <Link to={'/game/create'}>
          <div className="searchgame-button mr-2">Create game</div>
        </Link>
      </div>
    </div>
  );
}
