import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import MiniUserCard from '../../ui/MiniUserCard';
import { PublicUser } from '../../../../../shared/common/types/user.type';
import NiceBox from '../../ui/NiceBox';
import { useSearchParams } from 'react-router-dom';

type GameSelectFriendProps = {
  selectedFriend: number | null;
  // setSelectedFriend: Dispatch<SetStateAction<number | null>>;
  // setSelectedFriendName: Dispatch<SetStateAction<string>>;
};

function GameSelectFriend({ selectedFriend }: GameSelectFriendProps) {
  const axiosInstance = useAxiosPrivate();
  const [friendList, setFriendList] = useState<PublicUser[]>([]);
  const [_, setSearchParams] = useSearchParams();

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
                setSearchParams(
                  {
                    friend: friend.id.toString(),
                    name: friend.name,
                  },
                  { replace: true },
                );
                // setSelectedFriend(friend.id);
                // setSelectedFriendName(friend.name);
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
  );
}

export default GameSelectFriend;
