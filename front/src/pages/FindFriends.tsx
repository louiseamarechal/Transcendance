import '../style/pages/FindFriends.css';
import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard.tsx';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';

function FindFriends() {
  const axiosInstance = useAxiosPrivate();
  const [array, setArray] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('users') //a modifier en fonction
      .then((res) => {
        setArray(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <div className="findfriends-container friend-card">
        {/* <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '}
        </div>
        <div className="friend-card">
          <UserCard />{' '} */}
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

export default FindFriends;