import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import UserCard from './ui/UserCard';
import { PublicUser } from '../../../shared/common/types/user.type';
import { notifSocket } from '../api/socket';

type PendingFriendsProps = {
  pendingFR: PublicUser[];
  setPendingFR: React.Dispatch<React.SetStateAction<PublicUser[]>>;
};

const PendingFriends = (props: PendingFriendsProps) => {
  const axiosInstance = useAxiosPrivate();

  useEffect(() => {
    function getPendingRequests() {
      axiosInstance
        .get('user/pending-request')
        .then((res) => {
          props.setPendingFR(res.data);
        })
        .catch((err) => console.log(err));
    }

    getPendingRequests();

    notifSocket.on('server.notif.friends', getPendingRequests);

    return () => {
      notifSocket?.off('server.notif.friends', getPendingRequests);
    };
  }, []);

  if (props.pendingFR.length > 0) {
    return (
      <div>
        <h2>Pending Requests : </h2>
        <div className="all-friends-cards">
          {props.pendingFR.map((user, index) => {
            return (
              <div className="friend-card">
                <UserCard user={user} key={index} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <h2>Pending Requests : </h2>
      <p className="text">No pending requests</p>
    </div>
  );
};

export default PendingFriends;
