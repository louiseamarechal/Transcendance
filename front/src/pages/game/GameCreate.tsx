import { useEffect, useState } from 'react';
import '../../style/flexUtils.css';
import GameSelectFriend from '../../components/game/GameCreate/GameSelectFriend';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { gameSocket } from '../../api/socket';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useUser } from '../../hooks/useUser';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';

export default function GameCreate() {
  const [selectedFriend, setSelectedFriend] = useState<number>(-1);
  const [isWaitingOpponent, setIsWaitingOpponent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { myId } = useUser();
  // const navigate = useNavigate();

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

    gameSocket.on(
      ServerEvents.privateGameCreated,
      handlePrivateGameCreatedEvent,
    );
    gameSocket.on(
      ServerEvents.privateGameNotCreated,
      handlePrivateGameNotCreatedEvent,
    );

    return () => {
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

  function handleCreateGame() {
    if (selectedFriend !== -1) {
      console.log('handleCreateGame');
      const payload: ClientPayloads[ClientEvents.GameCreateGame] = {
        p1Id: myId,
        p2Id: selectedFriend,
      };
      gameSocket.emit(ClientEvents.GameCreateGame, payload);
    }
  }

  return (
    <div className="h-full flex-row-center overflow-auto">
      {!isWaitingOpponent ? (
        <div className="border-8 border-red-700 w-[80%] flex-col-center h-full">
          <div>select a friend</div>
          <GameSelectFriend
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
          />
          <p>{`You selected ${selectedFriend}`}</p>
          <button onClick={handleCreateGame}>Create Game</button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <div>Waiting for your opponent</div>
      )}
    </div>
  );
}
