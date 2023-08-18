import { useState } from 'react';
import '../../style/flexUtils.css';
import GameSelectFriend from '../../components/game/GameCreate/GameSelectFriend';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { gameSocket } from '../../api/socket';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useUser } from '../../hooks/useUser';

export default function GameCreate() {
  const [selectedFriend, setSelectedFriend] = useState<number>(-1);
  const { myId } = useUser();

  function handleCreateGame() {
    if (selectedFriend !== -1) {
      console.log('handle create game');
      const payload: ClientPayloads[ClientEvents.GameCreateGame] = {
        p1Id: myId,
        p2Id: selectedFriend,
      };
      gameSocket.emit(ClientEvents.GameCreateGame, payload);
    }
  }

  return (
    <div className="h-full flex-row-center overflow-auto">
      <div className="border-8 border-red-700 w-[80%] flex-col-center h-full">
        <div>select a friend</div>
        <GameSelectFriend
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
        />
        <p>{`You selected ${selectedFriend}`}</p>
        <button onClick={handleCreateGame}>Create Game</button>
      </div>
    </div>
  );
}
