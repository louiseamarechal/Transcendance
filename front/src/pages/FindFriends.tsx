import '../style/pages/FindFriends.css';

import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard.tsx';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { Link } from 'react-router-dom';
import { PublicUser } from '../../../shared/common/types/user.type.ts';

function FindFriends() {
  const axiosInstance = useAxiosPrivate();
  const [allUsers, setAllUsers] = useState([]);
  const [myFriends, setMyFriends] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('user/all')
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((e) => console.log(e));

    axiosInstance.get('friend-request/my-friends').then((res) => {
      setMyFriends(res.data);
    });
  }, []);

  const unkownUsers = allUsers.filter(
    (user: PublicUser) =>
      myFriends.find((friend: PublicUser) => friend.id === user.id) === undefined,
  );

  if (unkownUsers.length > 0) {
    return (
      <>
        <div className="findfriends-container">
          {unkownUsers.map((elem, index) => {
            return (
              <div className="friend-card" key={index}>
                <UserCard user={elem} />
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>It seems you are already friends with all our users ...</p>
      <Link to="/friends">Go check out your friends <strong>here</strong> !</Link>
    </div>
  );
}

export default FindFriends;
