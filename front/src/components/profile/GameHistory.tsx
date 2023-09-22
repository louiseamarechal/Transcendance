import { GameSchema } from '../../../../shared/common/types/game.type';
import NiceBox from '../ui/NiceBox';
import GameHistoryCard from './GameHistoryCard';
type GameHistoryProps = {
  games: GameSchema[];
  profileId: number;
};

function GameHistory({ games, profileId }: GameHistoryProps) {
  const gameList = games.map((g) => {
    return <GameHistoryCard game={g} profileId={profileId} key={g.id} />;
  });

  return (
    <NiceBox title="Match History">
      {games.length === 0 && <div>No game played yet</div>}
      <div className="w-[80%]">{gameList}</div>
    </NiceBox>
  );
}

export default GameHistory;
