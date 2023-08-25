import { useEffect, useState } from 'react';
import '../../style/flexUtils.css';
import { gameSocket } from '../../api/socket';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { useNavigate } from 'react-router-dom';
import GameCreateSelect from '../../components/game/GameCreate/GameCreateSelect';

export default function GameCreate() {
  const [isWaitingOpponent, setIsWaitingOpponent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    function handlePrivateGameCreatedEvent() {
      console.log('handlePrivateGameCreatedEvent');
      setIsWaitingOpponent(true);
    }

    function handlePrivateGameNotCreatedEvent(
      data: ServerPayloads[ServerEvents.privateGameNotCreated],
    ) {
      console.log('handlePrivateGameNotCreatedEvent');
      setError(data.why);
    }

    function handleGameRefused() {
      setError('Game Refused');
      setTimeout(() => {
        navigate('/game');
      }, 2000);
    }

    gameSocket.on(
      ServerEvents.privateGameCreated,
      handlePrivateGameCreatedEvent,
    );
    gameSocket.on(
      ServerEvents.privateGameNotCreated,
      handlePrivateGameNotCreatedEvent,
    );
    gameSocket.on(ServerEvents.gameRefused, handleGameRefused);

    return () => {
      gameSocket.off(ServerEvents.gameRefused, handleGameRefused);
      gameSocket.off(
        ServerEvents.privateGameNotCreated,
        handlePrivateGameNotCreatedEvent,
      );
      gameSocket.off(
        ServerEvents.privateGameCreated,
        handlePrivateGameCreatedEvent,
      );
    };
  }, []);

  return (
    <div className="h-full flex-row-center overflow-auto">
      {!isWaitingOpponent ? (
        <>
          <GameCreateSelect />
          {error && <p className="text-red-500">{error}</p>}
        </>
      ) : (
        <>
          <div>Waiting for your opponent</div>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
