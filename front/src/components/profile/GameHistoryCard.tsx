import { useNavigate } from 'react-router-dom';
import { GameSchema } from '../../../../shared/common/types/game.type';

type GameHistoryCardProps = {
  game: GameSchema;
  profileId: number;
};

function GameHistoryCard({ game, profileId }: GameHistoryCardProps) {
  const navigate = useNavigate();

  let style = 'flex-row-center m-2 rounded-lg whitespace-nowrap';

  if (game.winnerId === profileId) {
    style += ' bg-[#cee2fb]';
  } else {
    style += ' bg-[#f9d2b6]';
  }

  function handleClickToProfile(
    event: React.MouseEvent<HTMLButtonElement>,
    toId: number,
    profileId: number,
  ) {
    event.preventDefault();
    if (profileId != toId) {
      navigate(`/profil/${toId}`);
    }
  }

  if (game.winnerId)
    return (
      <div className={style}>
        <div className="w-[10%]">{game.score1}</div>
        <div className="w-[5%]"></div>
        <button
          className="w-[20%] text-ellipsis overflow-hidden hover:font-bold"
          onClick={(e) => handleClickToProfile(e, game.player1Id, profileId)}
        >
          {game.player1Name}
        </button>
        <div className="w-[5%]"></div>
        <div className="w-[20%]">VS</div>
        <div className="w-[5%]"></div>
        <button
          className="w-[20%] text-ellipsis overflow-hidden hover:font-bold"
          onClick={(e) => handleClickToProfile(e, game.player2Id!, profileId)}
        >
          {game.player2Name}
        </button>
        <div className="w-[5%]"></div>
        <div className="w-[10%]">{game.score2}</div>
      </div>
    );
}

export default GameHistoryCard;
