import { useEffect } from 'react';
import { gameSocket } from '../../api/socket';
import { useNavigate } from 'react-router-dom';

export default function GameQueue() {
  const navigate = useNavigate();

  useEffect(() => {
    gameSocket.emit('client.game.joinQueue');

    return () => {
      gameSocket.emit('client.game.leaveQueue');
    };
  }, []);

  function handleCancel() {
    navigate('/game');
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