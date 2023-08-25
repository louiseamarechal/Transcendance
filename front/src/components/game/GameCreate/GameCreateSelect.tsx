import { useState } from 'react';
import GameSelectFriend from './GameSelectFriend';
import { ClientPayloads } from '../../../../../shared/client/ClientPayloads';
import { ClientEvents } from '../../../../../shared/client/ClientEvents';
import { useUser } from '../../../hooks/useUser';
import { gameSocket } from '../../../api/socket';
import GameSelectPaddleSize from './GameSelectPaddleSize';
import HorizontalNet from '../../utils/HorizontalNet';

function GameCreateSelect() {
  const [selectedFriend, setSelectedFriend] = useState<number>(-1);
  const [p1PaddleSize, setP1PaddleSize] = useState<number>(0.1);
  const [p2PaddleSize, setP2PaddleSize] = useState<number>(0.1);
  const { myId } = useUser();

  function handleCreateGame() {
    if (selectedFriend !== -1) {
      console.log('handleCreateGame');
      const payload: ClientPayloads[ClientEvents.GameCreateGame] = {
        p1Id: myId,
        p2Id: selectedFriend,
        p1PaddleSize: p1PaddleSize,
        p2PaddleSize: p2PaddleSize,
      };
      gameSocket.emit(ClientEvents.GameCreateGame, payload);
    }
  }

  return (
    <div className="w-[80%] flex-col-center h-full">
      <div>Select a friend</div>
      <GameSelectFriend
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
      />
      <p>{`You selected ${selectedFriend}`}</p>
      <HorizontalNet />
      <GameSelectPaddleSize
        text="Select P1 Paddle Size"
        paddleSize={p1PaddleSize}
        setPaddleSize={setP1PaddleSize}
      />
      <GameSelectPaddleSize
        text="Select P2 Paddle Size"
        paddleSize={p2PaddleSize}
        setPaddleSize={setP2PaddleSize}
      />
      <HorizontalNet />
      <button onClick={handleCreateGame}>Create Game</button>
    </div>
  );
}

export default GameCreateSelect;
