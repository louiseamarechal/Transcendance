import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { PublicUser } from '../../../shared/common/types/user.type';
import ProgressBar from '../components/ProgressBar';
import { ProfilStat } from '../components/ProfilStat';
import { FriendRequest } from '../types/FriendRequest.type';
import Avatar from '../components/Avatar';
import ActivityStatus from '../components/ActivityStatus';
import { notifSocket } from '../api/socket';
import GameHistory from '../components/profile/GameHistory';
import { GameSchema } from '../../../shared/common/types/game.type';
import ProfileStatistics from '../components/profile/ProfileStatistics';
import ProfileAchievements from '../components/profile/ProfileAchievements';

export default function UserProfile() {
  const { id } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<PublicUser>({} as PublicUser);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { myId } = useUser();
  const navigate = useNavigate();
  const [FR, setFR] = useState<FriendRequest>({});
  const [refresh, setRefresh] = useState(false);
  const [games, setGames] = useState<GameSchema[]>([]);

  console.log('Entering UserProfile component with id =', id);

  useEffect(() => {
    if (myId.toString() === id) {
      navigate('/profil');
    }

    function getUserInfo() {
      axiosInstance
        .get(`user/${id}`)
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

    axiosInstance
      .get(`friend-request/with/${id}`)
      .then((res) => {
        if (res.data[0]) {
          setFR(res.data[0]);
          console.log('data[0].fromId pour voir', res.data[0].fromId);
        } else {
          setFR({});
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      notifSocket.off('disconnect', getUserInfo);
      notifSocket.off('reconnect', getUserInfo);
    };
  }, [id, refresh, axiosInstance]);

  useEffect(() => {
    axiosInstance
      .get(`game/${id}`)
      .then((res) => {
        setGames(res.data);
      })
      .catch(() => {});
  }, [id]);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  const handleAddFriend = () => {
    axiosInstance
      .post(`friend-request/${id}`, {})
      .then((response) => {
        console.log(response.data);
        if (refresh === false) setRefresh(true);
        else setRefresh(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAcceptFriend = () => {
    axiosInstance
      .patch(`friend-request/${FR.id}`, { status: 'ACCEPTED' })
      .then((response) => {
        console.log(response.data);
        if (refresh === false) setRefresh(true);
        else setRefresh(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveFR = () => {
    axiosInstance.delete(`friend-request/${FR.id}`).then(() => {
      if (refresh === false) setRefresh(true);
      else setRefresh(false);
    });
  };

  return (
    <div className="profil-container">
      <div className="flex flex-row w-[55%] justify-end">
        <div className="profil-card">
          <Avatar id={user.id} />
          <div className="flex flex-row items-center">
            <p className="user-name">{user?.name}</p>
          </div>
        </div>
        <ActionButtons
          status={FR.status ?? ''}
          activity={user.status}
          myId={myId}
          fromId={FR.fromId ?? ''}
          handleAddFriend={handleAddFriend}
          handleAcceptFriend={handleAcceptFriend}
          handleRemoveFR={handleRemoveFR}
        />
      </div>
      {`Level ${Math.floor(user.level)} `}
      <ProgressBar user={user} />

      {id && (
        <>
          <ProfileStatistics games={games} userId={Number(id)} />
          <ProfileAchievements  achievement={user.achievement}/>
          <GameHistory games={games} id={Number(id)} />
        </>
      )}
    </div>
  );
}

type ActionButtonsProps = {
  status: string;
  activity: string;
  handleAddFriend: Function;
  handleAcceptFriend: Function;
  handleRemoveFR: Function;
  myId: number;
  fromId: string;
};
function ActionButtons({
  status,
  activity,
  myId,
  fromId,
  handleAddFriend,
  handleAcceptFriend,
  handleRemoveFR,
}: ActionButtonsProps) {
  if (status === 'ACCEPTED') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleRemoveFR();
          }}
        >
          Remove Friend
        </button>
        <ActivityStatus activity={activity} />
      </div>
    );
  } else if (parseInt(fromId) === myId && status !== 'REFUSED') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button className="small-button friend-request-button">Pending</button>
      </div>
    );
  } else if (fromId !== '' && myId !== parseInt(fromId)) {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleAcceptFriend();
          }}
        >
          Accept
        </button>
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleRemoveFR();
          }}
        >
          Decline
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleAddFriend();
          }}
        >
          Add friend
        </button>
      </div>
    );
  }
}
