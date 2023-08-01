import '../style/pages/Friends.css';
import UserCard from '../components/UserCard.tsx';
// import { User } from '../types/User.type.ts';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { Link } from 'react-router-dom';
import PendingFriends from '../components/PendingFriends.tsx';

function Friends() {
  const axiosInstance = useAxiosPrivate();
  const [array, setArray] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('friend-request/my-friends')
      .then((res) => {
        setArray(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <div className="findfriends-container friend-card">
        {array.length <= 0 ? (
          <div>
            <PendingFriends />
            <p>You don't have any Friends yet...</p>
            <Link to='/findfriends'>You can invite your Friends <strong>here</strong></Link>
          </div>
        ) : (
          array.map((elem) => {
            return (
              <>
              <PendingFriends />
              <div className="friend-card">
                <UserCard user={elem} />
              </div>
              </>
            );
          })
        )}
      </div>
    </>
  );
}

export default Friends;
