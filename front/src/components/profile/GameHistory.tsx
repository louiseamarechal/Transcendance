import { GameSchema } from '../../../../shared/common/types/game.type';
import NiceBox from '../box/NiceBox';

type GameHistoryProps = {
  games: GameSchema[];
};

function GameHistory({ games }: GameHistoryProps) {
  const gameList = games.map((g) => {
    return (
      <div className="flex-row-center ">
        <div>{g.score1}</div>
        <div className="w-5"></div>
        <div>{g.player1Name}</div>
        <div className="w-5"></div>
        <div>VS</div>
        <div className="w-5"></div>
        <div>{g.player2Name}</div>
        <div className="w-5"></div>
        <div>{g.score2}</div>
      </div>
    );
  });

  return (
    <NiceBox title="Match History">
      {games.length === 0 && <div>No game played yet</div>}
      <div>{gameList}</div>
    </NiceBox>
  );
}

export default GameHistory;
