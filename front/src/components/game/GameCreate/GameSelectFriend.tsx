import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import MiniUserCard from '../../MiniUserCard';
import { PublicUser } from '../../../../../shared/common/types/user.type';

type GameSelectFriendProps = {
  selectedFriend: number;
  setSelectedFriend: Dispatch<SetStateAction<number>>;
};

// type Friend = {
//   id: number;
//   name: string;
//   level: number;
//   avatar: string;
// };

function GameSelectFriend({
  selectedFriend,
  setSelectedFriend,
}: GameSelectFriendProps) {
  const axiosInstance = useAxiosPrivate();
  const [friendList, setFriendList] = useState<PublicUser[]>([]);

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
    <div className="flex-row-center flex-wrap space-x-4">
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