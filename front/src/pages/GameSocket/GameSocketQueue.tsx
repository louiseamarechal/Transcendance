import { useEffect } from 'react';
import { socket } from '../../api/socket';
import { useNavigate } from 'react-router-dom';

function GameQueue() {
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('client.game.joinQueue');

    return () => {
      socket.emit('client.game.leaveQueue');
    };
  }, []);

  function handleCancel() {
    navigate('/gamesocket');
  }

  return (
    <div className="waiting-for-game">
      <h1 className="pong-title">PONG</h1>
      <p>Wait until we find you the perfect match !</p>
      <br />
      <div className="spinner"></div>
      <br />
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default GameQueue;
