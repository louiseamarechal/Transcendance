import { useEffect, useState } from 'react';
import { gameSocket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import NiceButton from '../../components/ui/NiceButton';
import NiceBox from '../../components/ui/NiceBox';

export default function GameSearch() {
  const [isQueuing, setIsQueuing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function joinQueue() {
    console.log('joinQueue');
    gameSocket.emit(ClientEvents.GameJoinQueue, (response: string) => {
      console.log(response);
      switch (response) {
        case 'Already in game':
          setError(response);
          break;

        case 'Game created':
          setIsQueuing(true);
          break;

        default:
          break;
      }
    });
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
      <NiceBox>Wait until we find you the perfect match !</NiceBox>
      <div className="spinner"></div>
      <NiceButton onClick={leaveQueue}>Leave Queue</NiceButton>
    </>
  );

  const noQueuingJSX = (
    <>
      <NiceButton onClick={joinQueue}>Join Queue</NiceButton>
    </>
  );

  return (
    <div className="h-full flex-col-center">
      <div className="pong-title">PONG</div>
      {isQueuing ? queuingJSX : noQueuingJSX}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
