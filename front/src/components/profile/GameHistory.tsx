import { useEffect, useState } from 'react';
import { GameSchema } from '../../../../shared/common/types/game.type';
import { useUser } from '../../hooks/useUser';
import NiceBox from '../ui/NiceBox';
import GameHistoryCard from './GameHistoryCard';
type GameHistoryProps = {
  games: GameSchema[];
  id: number;
};

function GameHistory({ games, id }: GameHistoryProps) {
  const gameList = games.map((g) => {
    return <GameHistoryCard game={g} id={id} key={g.id} />;
  });

  return (
    <NiceBox title="Match History">
      {games.length === 0 && <div>No game played yet</div>}
      <div className="w-[80%]">{gameList}</div>
    </NiceBox>
  );
}

export default GameHistory;
