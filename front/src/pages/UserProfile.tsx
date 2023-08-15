import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from '../types/User.type';
import ProgressBar from '../components/ProgressBar';
import { ProfilStat } from '../components/ProfilStat';
import { FriendRequest } from '../types/FriendRequest.type';
import Avatar from '../components/Avatar';

export default function UserProfile() {
  const { id } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({ id: NaN });
  const [isLoading, setLoading] = useState<boolean>(true);
  const { myId } = useUser();
  const navigate = useNavigate();
  const [FR, setFR] = useState<FriendRequest>({});
  const [refresh, setRefresh] = useState(false);

  console.log('Entering UserProfile component with id =', id);

  const divStyle = [
    'w-3/5',
    'h-3/5',
    'flex flex-row items-start justify-evenly gap-10 pt-6',
    'border-t-[1px]',
    'border-r-[2px]',
    'border-b-[2px]',
    'border-l-[1px]',
    'border-[#0000001C]',
    'rounded-[50px]',
    'shadow-lg',
    'flex-wrap',
  ].join(' ');

  useEffect(() => {
    if (myId.toString() === id) {
      navigate('/profil');
    }

    axiosInstance
      .get(`user/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((_) => {
        navigate('/game');
      });

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
  }, [id, refresh]);

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

  const handleGameRequest = async () => {
    await axiosInstance
      .post(`game/${id}`, {})
      .then((response) => {
        console.log({ handleGameRequest: response.data });
      })
      .catch((error) => {
        if (error.response.status !== 409) console.error(error);
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
          myId={myId}
          fromId={FR.fromId ?? ''}
          handleAddFriend={handleAddFriend}
          handleAcceptFriend={handleAcceptFriend}
          handleRemoveFR={handleRemoveFR}
          handleGameRequest={handleGameRequest}
        />
      </div>
      <ProgressBar user={user} />
      <div className={divStyle}>
        <ProfilStat user={user} />
      </div>
    </div>
  );
}

type ActionButtonsProps = {
  status: string;
  handleAddFriend: Function;
  handleAcceptFriend: Function;
  handleRemoveFR: Function;
  handleGameRequest: Function;
  myId: number;
  fromId: string;
};
function ActionButtons({
  status,
  myId,
  fromId,
  handleAddFriend,
  handleAcceptFriend,
  handleRemoveFR,
  handleGameRequest,
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
        <button
          className="small-button game-request-button"
          onClick={() => {
            handleGameRequest();
          }}
        >
          Send game request
        </button>
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
        <button
          className="small-button game-request-button"
        >
          Send game request
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
        <button
          className="small-button game-request-button"
        >
          Send game request
        </button>
      </div>
    );
  }
}
