import '../style/pages/FindFriends.css';

import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard.tsx';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { User } from '../types/User.type.ts';

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
    (user: User) =>
      myFriends.find((friend: User) => friend.id === user.id) === undefined,
  );

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

export default FindFriends;
