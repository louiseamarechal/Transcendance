import '../style/pages/Friends.css';
import UserCard from '../components/UserCard.tsx';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { Link } from 'react-router-dom';
import PendingFriends from '../components/PendingFriends.tsx';
import { PublicUser } from '../../../shared/common/types/user.type.ts';

function Friends() {
  const axiosInstance = useAxiosPrivate();
  const [array, setArray] = useState<PublicUser[]>([]);
  const [pendingFR, setPendingFR] = useState<PublicUser[]>([]);

  useEffect(() => {
    axiosInstance
      .get('friend-request/my-friends')
      .then((res) => {
        setArray(res.data);
      })
      .catch((e) => console.log(e));
  }, [axiosInstance]);

  if (array.length <= 0 && pendingFR.length <= 0) {
    return (
      <div className="friends-container">
        <PendingFriends pendingFR={pendingFR} setPendingFR={setPendingFR} />
        <div className="friend-inside-container">
          <Link to="/findfriends">
            You can invite your Friends <strong>here</strong>
          </Link>
        </div>
      </div>
    );
  } else if (array.length > 0) {
    return (
      <div className="friends-container">
        <PendingFriends pendingFR={pendingFR} setPendingFR={setPendingFR} />
        <div className="friend-inside-container">
          <h2>Friends :</h2>
          <div className="all-friends-cards">
            {array.map((elem, index) => {
              return (
                <div className="friend-card" key={index}>
                  <UserCard user={elem} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="friends-container">
      <PendingFriends pendingFR={pendingFR} setPendingFR={setPendingFR} />
    </div>
  );
}

export default Friends;
