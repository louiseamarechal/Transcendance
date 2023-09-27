import { useEffect, useState } from 'react';
import GameSelectFriend from './GameSelectFriend';
import { ClientPayloads } from '../../../../../shared/client/ClientPayloads';
import { ClientEvents } from '../../../../../shared/client/ClientEvents';
import { useUser } from '../../../hooks/useUser';
import { gameSocket } from '../../../api/socket';
import GameSelectPaddleSize from './GameSelectPaddleSize';
import NiceButton from '../../ui/NiceButton';
import { useSearchParams } from 'react-router-dom';

type GameCreateSelectProps = {
  friendId?: number | null;
};

function GameCreateSelect({ friendId = null }: GameCreateSelectProps) {
  const [selectedFriend, setSelectedFriend] = useState<number | null>(friendId);
  const [selectedFriendName, setSelectedFriendName] = useState<string>('');
  const [p1PaddleSize, setP1PaddleSize] = useState<number>(0.1);
  const [p2PaddleSize, setP2PaddleSize] = useState<number>(0.1);
  const { myId } = useUser();

  const [searchParams, _] = useSearchParams();

  function handleCreateGame() {
    if (selectedFriend !== null) {
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

  useEffect(() => {
    const friendId: string | null = searchParams.get('friend');
    const friendName: string | null = searchParams.get('name');
    if (friendId) setSelectedFriend(Number(friendId));
    if (friendName) setSelectedFriendName(friendName);
  }, [searchParams]);

  return (
    <div className="w-full flex-col-center">
      <GameSelectFriend
        selectedFriend={selectedFriend}
        // setSelectedFriend={setSelectedFriend}
        // setSelectedFriendName={setSelectedFriendName}
      />

      {selectedFriend && (
        <>
          <GameSelectPaddleSize
            selectedFriendName={selectedFriendName}
            P1PaddleSize={p1PaddleSize}
            setP1PaddleSize={setP1PaddleSize}
            P2PaddleSize={p2PaddleSize}
            setP2PaddleSize={setP2PaddleSize}
          />

          <NiceButton onClick={handleCreateGame}>Create Game</NiceButton>
        </>
      )}
    </div>
  );
}

export default GameCreateSelect;
