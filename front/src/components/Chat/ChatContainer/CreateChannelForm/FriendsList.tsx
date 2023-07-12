import { SetStateAction, useEffect, useState } from 'react';
import '../../../../style/components/chat/chat-container/create-channel-form/friends-list.css';
import UserSmallCard from './FriendsList/UserSmallCard';
import { axiosPrivate } from '../../../../api/axios';

const FriendsList = ({
  selectedFriends,
  setSelectedFriends,
}: {
  selectedFriends: number[];
  setSelectedFriends: React.Dispatch<SetStateAction<number[]>>;
}) => {
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
        <ul className="dual-column">
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
