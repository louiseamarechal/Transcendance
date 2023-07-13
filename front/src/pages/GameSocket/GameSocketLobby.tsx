import { useNavigate } from 'react-router-dom';
import { socket } from '../../api/socket';

export default function GameSocketLobby() {
  const navigate = useNavigate()

  const handleSearchGame = async () => {
    navigate('/gamesocket/queue')
    // socket.emit('client.game.searchgame');
  };

  return (
    <div className="gamepage-container">
      <button
        onClick={() => {
          socket.emit('toto', 'eventdata');
        }}
        className="text-9xl text-red-900"
      >
        Test
      </button>
      <h1 className="gamepage-title">PONG</h1>
      <div className="net-container">
        <button className="searchgame-button mr-2" onClick={handleSearchGame}>
          Search Game
        </button>
        <div className="net"></div>
        <button className="searchgame-button m1-2">Invite Friends</button>
      </div>
    </div>
  );
}
