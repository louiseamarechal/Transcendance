import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import UserCard from './UserCard';

// type PendingFriendsProps = {
//   pendingFR: [];
//   setPendingFR: React.Dispatch<React.SetStateAction<[]>>;
// };

const PendingFriends = () => {
  const axiosInstance = useAxiosPrivate();
  const [pendingFR, setPendingFR] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('user/pending-request')
      .then((res) => {
        setPendingFR(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (pendingFR.length > 0) {
    return (
      <div className='friend-inside-container'>
        <h2>Pending Requests : </h2>
        <div className="all-friends-cards">
          {pendingFR.map((user) => {
            return (
              <div className="friend-card">
                <UserCard user={user} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <></>;
};

export default PendingFriends;
