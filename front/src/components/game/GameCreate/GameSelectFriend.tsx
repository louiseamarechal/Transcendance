import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import MiniUserCard from '../../MiniUserCard';
import { PublicUser } from '../../../../../shared/common/types/user.type';
import NiceBox from '../../ui/NiceBox';

type GameSelectFriendProps = {
  selectedFriend: number | null;
  setSelectedFriend: Dispatch<SetStateAction<number | null>>;
  setSelectedFriendName: Dispatch<SetStateAction<string>>;
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
  setSelectedFriendName,
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
    <NiceBox title="Select a Friend">
      <div className="flex-row-center flex-wrap">
        {friendList.map((friend) => {
          return (
            <div
              key={friend.id}
              onClick={() => {
                setSelectedFriend(friend.id);
                setSelectedFriendName(friend.name);
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
      {/* <p>{`You selected ${selectedFriend}`}</p> */}
    </NiceBox>

    // <div className="flex-row-center flex-wrap space-x-4">
    // </div>
  );
}

export default GameSelectFriend;
