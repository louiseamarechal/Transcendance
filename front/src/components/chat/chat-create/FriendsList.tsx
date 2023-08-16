import { SetStateAction, useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/create-channel-form/friends-list.css';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import UserSmallCard from './components/UserSmallCard';

const FriendsList = ({
  selectedFriends,
  setSelectedFriends,
}: {
  selectedFriends: number[];
  setSelectedFriends: React.Dispatch<SetStateAction<number[]>>;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [friends, setFriends] = useState<
    { id: number; name: string; level: number; avatar: string }[]
  >([]);

  useEffect(() => {
    axiosPrivate
      .get('friend-request/my-friends')
      .then((res) => {
        console.log(res);
        setFriends(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  return (
    <div className="friends-list">
      <p>Choose friends to add to channel</p>
      <div className="scrollable-list">
        <ul>
          {friends.map(
            (friend: {
              id: number;
              name: string;
              avatar: string;
              level: number;
            }) => {
              return (
                <li key={friend.id}>
                  <UserSmallCard
                    key={`user-card-${friend.id}`}
                    friend={friend}
                    selectedFriends={selectedFriends}
                    setSelectedFriends={setSelectedFriends}
                  />
                </li>
              );
            },
          )}
        </ul>
      </div>
    </div>
  );
};

export default FriendsList;
