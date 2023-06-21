import '../style/pages/Friends.css';
import UserCard from '../components/UserCard.tsx';
// import { User } from '../types/User.type.ts';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';

const axiosInstance = useAxiosPrivate();

// const user = {
//   name: 'truc',
//   avatar: 'coucou',
//   level: 5,
// };

// const array = [user, user, user, user];

function Friends() {
  const [array, setArray] = useState([]);
  // const [user, setUser] = useState<User>({
  //   name: 'toi',
  //   avatar: 'lol',
  //   level: 8
  // });
  
    useEffect(() => {
    axiosInstance
      .get('friend-request/myfriends')
      .then((res) => {
        setArray(res.data)
      })
      .catch((e) => console.log(e));
  }, []);


  return (
    <>
      {/* <NavBar/> */}
      <div className="findfriends-container friend-card">
        {/* <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '}
        </div>
        <div className="friend-card">
          <UserCard user={user} />{' '} */}
        {/* </div> */}
        {array.map((elem) => {
          return (
            <div className="friend-card">
              <UserCard user={elem} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Friends;
