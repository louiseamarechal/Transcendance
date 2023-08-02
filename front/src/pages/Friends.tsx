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
  // const [pendingFR, setPendingFR] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('friend-request/my-friends')
      .then((res) => {
        setArray(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  if (array.length <= 0) {
    return (
      <div className="friends-container">
        <PendingFriends />
        <div className='friend-inside-container'>
          {/* <p>You don't have any Friends yet...</p> */}
          <Link to="/findfriends">
            You can invite your Friends <strong>here</strong>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-container">
      <PendingFriends />
      <div className="friend-inside-container">
        <h2>Friends :</h2>
        <div className="all-friends-cards">
          {array.map((elem) => {
            return (
              <>
                <div className="friend-card">
                  <UserCard user={elem} />
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Friends;
