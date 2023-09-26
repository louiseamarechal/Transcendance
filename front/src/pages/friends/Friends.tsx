import UserCard from '../../components/ui/UserCard.js';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';
import { Link } from 'react-router-dom';
import PendingFriends from '../../components/PendingFriends.js';
import { PublicUser } from '../../../../shared/common/types/user.type.js';

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
        <div className="w-full">
          <h2>Friends :</h2>
          <Link to="/findfriends" className="text">
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
                  <UserCard user={elem} showStatus={true} />
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
      <div className="w-full">
        <h2>Friends :</h2>
        <Link to="/findfriends" className="text">
          You can invite your Friends <strong>here</strong>
        </Link>
      </div>
    </div>
  );
}

export default Friends;
