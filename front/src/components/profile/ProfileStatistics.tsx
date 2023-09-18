import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMedal,
  faThumbsDown,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import NiceBox from '../ui/NiceBox';
import { GameSchema } from '../../../../shared/common/types/game.type';

type ProfileStatisticsProps = {
  games: GameSchema[];
  userId: number;
};

function ProfileStatistics({ games, userId }: ProfileStatisticsProps) {
  const wins = games.filter((g) => g.winnerId === userId).length;
  const loses = games.length - wins;
  const winrate = games.length !== 0 ? wins / games.length : 0;

  return (
    <NiceBox title="Statistics">
      <div className="flex-row-center flex-wrap">
        <div className=" flex-row-center mx-10 gap-2">
          <FontAwesomeIcon icon={faTrophy} style={{ color: '#f2be31' }} />
          <p>Wins:</p>
          <p>{wins}</p>
        </div>

        <div className=" flex-row-center mx-10 my-2 gap-2">
          <FontAwesomeIcon icon={faThumbsDown} style={{ color: '#dc091e' }} />
          <p>Loses:</p>
          <p>{loses}</p>
        </div>

        <div className=" flex-row-center mx-10 gap-2">
          <FontAwesomeIcon
            icon={faMedal}
            style={{ color: 'var(--faded-blue)' }}
          />
          <p>Winrate:</p>
          <p>{Math.round(winrate * 100)}%</p>
        </div>
      </div>
    </NiceBox>
  );
}

export default ProfileStatistics;
