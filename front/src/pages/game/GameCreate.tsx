import { useState } from 'react';
import '../../style/flexUtils.css';
import GameSelectFriend from '../../components/game/GameCreate/GameSelectFriend';

export default function GameCreate() {
  const [selectedFriend, setSelectedFriend] = useState<number>(-1);

  return (
    <div className="h-full flex-row-center overflow-auto">
      <div className="border-8 border-red-700 w-[80%] flex-col-center h-full">
        <div>select a friend</div>
        <GameSelectFriend
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
        />
        <p>{`You selected ${selectedFriend}`}</p>
        <button>Create Game</button>
      </div>
    </div>
  );
}
