import '../style/pages/FindFriends.css';
import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard.tsx';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';

function FindFriends() {
  const axiosInstance = useAxiosPrivate();
  const [array, setArray] = useState([]);

  const acceptAllFriends = () => {
    axiosInstance.patch('friend-request/accept-all');
  };

  useEffect(() => {
    axiosInstance
      .get('user/all') //a modifier en fonction
      .then((res) => {
        setArray(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <button onClick={acceptAllFriends}>Accept friends</button>
      <div className="findfriends-container friend-card">
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
