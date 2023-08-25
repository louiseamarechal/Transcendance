import { useEffect, useState } from 'react';
import { gameSocket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';

export default function GameSearch() {
  const [isQueuing, setIsQueuing] = useState<boolean>(false);

  function joinQueue() {
    console.log('joinQueue');
    gameSocket.emit(ClientEvents.GameJoinQueue);
    setIsQueuing(true);
  }

  function leaveQueue() {
    console.log('leaveQueue');
    gameSocket.emit(ClientEvents.GameLeaveQueue);
    setIsQueuing(false);
  }

  useEffect(() => {
    return () => {
      leaveQueue();
    };
  }, []);

  const queuingJSX = (
    <>
      <p>Wait until we find you the perfect match !</p>
      <br />
      <div className="spinner"></div>
      <br />
      <button onClick={leaveQueue}>Leave</button>
    </>
  );

  const noQueuingJSX = (
    <>
      <button onClick={joinQueue}>Queue</button>
    </>
  );

  return (
    <div className="h-full flex-col-center">
      <div className="pong-title">PONG</div>
      {isQueuing ? queuingJSX : noQueuingJSX}
    </div>
  );
}
