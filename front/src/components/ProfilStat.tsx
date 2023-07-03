import { useEffect } from 'react';
import { User } from '../types/User.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMedal,
  faQuestion,
  faThumbsDown,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';


export const ProfilStat = ({ user }: { user: User }) => {
  useEffect(() => {
    console.log('ProfileStat loaded', user);
  }, []);

  return (
    <>
        <div className="flex flex-col items-start content-center gap-3 flex-wrap">
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} style={{ color: '#f2be31' }} />
            <div>Victoires : {user?.statTotalWin}</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faThumbsDown} style={{ color: '#dc091e' }} />
            <div>
              Defaites :{' '}
              {user.statTotalGame && user.statTotalWin
                ? user?.statTotalGame - user?.statTotalWin
                : -1}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start content-center gap-3 flex-wrap">
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon
              icon={faMedal}
              style={{ color: 'var(--faded-blue)' }}
            />
            <div>Taux de victoire :</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faQuestion} style={{ color: 'var(--green)' }}/>
            <div>Other :</div>
          </div>
        </div>
    </>
  );
};
