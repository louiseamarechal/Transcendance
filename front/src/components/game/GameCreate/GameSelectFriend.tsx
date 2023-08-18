import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import MiniUserCard from '../../MiniUserCard';

type GameSelectFriendProps = {
  selectedFriend: number;
  setSelectedFriend: Dispatch<SetStateAction<number>>;
};

type Friend = {
  id: number;
  name: string;
  level: number;
  avatar: string;
};

function GameSelectFriend({
  selectedFriend,
  setSelectedFriend,
}: GameSelectFriendProps) {
  const axiosInstance = useAxiosPrivate();
  const [friendList, setFriendList] = useState<Friend[]>([]);

  useEffect(() => {
    axiosInstance
      .get('friend-request/my-friends')
      .then((res) => {
        setFriendList(res.data);
      })
      .catch(() => {
        console.log('get friend request my friends failed');
      });
  }, []);

  return (
    <div className="flex-row-center flex-wrap">
      {friendList.map((friend) => {
        return (
          <div
            key={friend.id}
            onClick={() => {
              setSelectedFriend(friend.id);
            }}
          >
            <MiniUserCard
              user={friend}
              selected={friend.id === selectedFriend ? true : false}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GameSelectFriend;
