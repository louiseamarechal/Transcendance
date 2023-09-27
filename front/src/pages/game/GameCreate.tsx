import { useEffect, useState } from 'react';
import '../../style/flexUtils.css';
import { gameSocket } from '../../api/socket';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { useNavigate } from 'react-router-dom';
import GameCreateSelect from '../../components/game/GameCreate/GameCreateSelect';
import NiceBox from '../../components/ui/NiceBox';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { GameRequest } from '../../../../shared/common/types/game.type';
import GameCreatedCard from '../../components/game/GameCreate/GameCreatedCard';
import { ClientEvents } from '../../../../shared/client/ClientEvents';

export default function GameCreate() {
  const axiosInstance = useAxiosPrivate();

  const [isWaitingOpponent, setIsWaitingOpponent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [myGR, setMyGR] = useState<GameRequest[]>([]);

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

  useEffect(() => {
    axiosInstance
      .get('/game/myGameCreated')
      .then((res) => {
        setMyGR(res.data);
      })
      .catch(() => {});
  }, []);

  function onDestroy(gr: GameRequest) {
    gameSocket.emit(ClientEvents.GameDestroyGR, { gameId: gr.gameId });
    axiosInstance
      .get('/game/myGameCreated')
      .then((res) => {
        setMyGR(res.data);
      })
      .catch(() => {});
  }

  return (
    <div className="h-full flex flex-col justify-start items-center overflow-auto">
      {myGR.length !== 0 && (
        <NiceBox title="Games you created">
          {myGR.map((gr) => {
            return <GameCreatedCard gr={gr} onDestroy={onDestroy} />;
          })}
        </NiceBox>
      )}

      {!isWaitingOpponent ? (
        <>
          <GameCreateSelect />
        </>
      ) : (
        <>
          <NiceBox>Waiting for your opponent</NiceBox>
          <div className="spinner"></div>
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
