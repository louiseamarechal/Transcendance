import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { PublicUser } from '../../../../shared/common/types/user.type';
import ProgressBar from '../../components/ui/ProgressBar';
import Avatar from '../../components/ui/Avatar';
import { notifSocket } from '../../api/socket';
import GameHistory from '../../components/profile/GameHistory';
import { GameSchema } from '../../../../shared/common/types/game.type';
import ProfileStatistics from '../../components/profile/ProfileStatistics';
import ProfileAchievements from '../../components/profile/ProfileAchievements';
import ActionButtons from '../../components/profile/ActionButtons';

export default function UserProfile() {
  const { profileId } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<PublicUser>({} as PublicUser);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { myId } = useUser();
  const navigate = useNavigate();
  const [games, setGames] = useState<GameSchema[]>([]);

  console.log('Entering UserProfile component with id =', profileId);

  useEffect(() => {
    if (myId.toString() === profileId) {
      navigate('/profil');
    }

    function getUserInfo() {
      axiosInstance
        .get(`user/${profileId}`)
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((_) => {
          navigate('/game');
        });
    }

    getUserInfo();

    notifSocket.on('disconnect', getUserInfo);
    notifSocket.on('reconnect', getUserInfo);

    return () => {
      notifSocket.off('disconnect', getUserInfo);
      notifSocket.off('reconnect', getUserInfo);
    };
  }, [profileId, axiosInstance]);

  useEffect(() => {
    axiosInstance
      .get(`game/${profileId}`)
      .then((res) => {
        setGames(res.data);
      })
      .catch(() => {});
  }, [profileId]);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  return (
    <div className="profil-container">
      <div className="flex flex-row w-[55%] justify-end">
        <div className="profil-card">
          <Avatar id={user.id} />
          <div className="flex flex-row items-center">
            <p className="user-name">{user?.name}</p>
          </div>
        </div>
        <ActionButtons activity={user.status} />
      </div>
      {`Level ${Math.floor(user.level)} `}
      <ProgressBar user={user} />

      {profileId && (
        <>
          <ProfileAchievements achievement={user.achievement} />
          <ProfileStatistics games={games} userId={Number(profileId)} />
          <GameHistory games={games} profileId={Number(profileId)} />
        </>
      )}
    </div>
  );
}
