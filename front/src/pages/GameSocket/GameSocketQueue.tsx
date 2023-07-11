import { useEffect } from 'react';
import { socket } from '../../api/socket';
import { ServerEvents } from '../../../../shared/server/ServerEvents';

function GameQueue() {
  useEffect(() => {
    function onFoundMatchEvent(value: any) {
      console.log('Found match', value);
    }

    socket.on(ServerEvents.FoundMatch, onFoundMatchEvent);

    return () => {
      socket.off(ServerEvents.FoundMatch, onFoundMatchEvent);
    };
  }, []);

  return (
    <div className="waiting-for-game">
      <h1 className="pong-title">PONG</h1>
      <p>Wait until we find you the perfect match !</p>
      <br />
      <div className="spinner"></div>
    </div>
  );
}

export default GameQueue;
