import { GameSchema } from '../../../../shared/common/types/game.type';

type GameHistoryCardProps = {
  game: GameSchema;
  id: number;
};

function GameHistoryCard({ game, id }: GameHistoryCardProps) {
  let style = 'flex-row-center m-2 rounded-lg whitespace-nowrap';

  if (game.winnerId === id) {
    style += ' bg-green-300';
  } else {
    style += ' bg-red-300';
  }

  if (game.winnerId)
    return (
      <div className={style}>
        <div className="w-[10%]">{game.score1}</div>
        <div className="w-[5%]"></div>
        <div className="w-[20%] text-ellipsis overflow-hidden ">
          {game.player1Name}
        </div>
        <div className="w-[5%]"></div>
        <div className="w-[20%]">VS</div>
        <div className="w-[5%]"></div>
        <div className="w-[20%] text-ellipsis overflow-hidden ">
          {game.player2Name}
        </div>
        <div className="w-[5%]"></div>
        <div className="w-[10%]">{game.score2}</div>
      </div>
    );
}

export default GameHistoryCard;
