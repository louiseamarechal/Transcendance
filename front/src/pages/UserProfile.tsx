import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from '../types/User.type';
import ProgressBar from '../components/ProgressBar';
import { ProfilStat } from '../components/ProfilStat';
import { FriendRequest } from '../types/FriendRequest.type';

export default function UserProfile() {
  const { id } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});
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
      .catch((e) => {
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
        setRefresh(true);
      })
      .catch((error) => {
        if (error.response.status !== 409) console.error(error);
      });
     
  };

  const handleAcceptFriend = () => {
    axiosInstance
      .patch(`friend-request/${FR.id}`, { status: 'ACCEPTED' })
      .then((response) => {
        console.log(response.data);
        setRefresh(true);
      })
      .catch((error) => {
         console.error(error);
      });
      
  };

  const handleDeclineFR = () => {
    axiosInstance
      .patch(`friend-request/${FR.id}`, { status: 'REFUSED' })
      .then((response) => {
        console.log(response.data);
        setRefresh(true);
      })
      .catch((error) => {
        if (error.response.status !== 409) console.error(error);
      });
      
  };

  return (
    <div className="profil-container">
      <div className="flex flex-row w-[55%] justify-end">
        <div className="profil-card">
          <img className="avatar" alt="avatar" src={user?.avatar} />
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
          handleDeclineFR={handleDeclineFR}
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
  handleDeclineFR: Function;
  myId: number;
  fromId: string;
};
function ActionButtons({
  status,
  myId,
  fromId,
  handleAddFriend,
  handleAcceptFriend,
  handleDeclineFR,
}: ActionButtonsProps) {

  if (status === 'ACCEPTED') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button className="small-button friend-request-button"onClick={() => {
            handleDeclineFR();
          }}>
          Remove Friend
        </button>
        <button className="small-button game-request-button">
          Send game request
        </button>
      </div>
    );
  } else if (parseInt(fromId) === myId) {
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
            handleDeclineFR();
          }}
        >
          Decline
        </button>
        <button className="small-button game-request-button">
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
        <button className="small-button game-request-button">
          Send game request
        </button>
      </div>
    );
  }
}
