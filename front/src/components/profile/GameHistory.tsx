import { useEffect, useState } from 'react';
import { GameSchema } from '../../../../shared/common/types/game.type';
import { useUser } from '../../hooks/useUser';
import NiceBox from '../ui/NiceBox';
import GameHistoryCard from './GameHistoryCard';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

type GameHistoryProps = {
  // games: GameSchema[];
  id: number;
};

function GameHistory({ id }: GameHistoryProps) {
  const axiosInstance = useAxiosPrivate();
  const [games, setGames] = useState<GameSchema[]>([]);

  useEffect(() => {
    axiosInstance
      .get(`game/${id}`)
      .then((res) => {
        setGames(res.data);
      })
      .catch(() => {});
  }, [id]);

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
