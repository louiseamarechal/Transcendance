import { SetStateAction } from 'react';
import '../../../../../style/components/chat/chat-container/create-channel-form/user-small-card.css';

const UserSmallCard = ({
  friend,
  selectedFriends,
  setSelectedFriends,
}: {
  friend: { id: number; name: string; level: number; avatar: string };
  selectedFriends: number[];
  setSelectedFriends: React.Dispatch<SetStateAction<number[]>>;
}) => {
  const handleOnClick = () => {
    if (selectedFriends.includes(friend.id)) {
      let copy = [...selectedFriends];
      setSelectedFriends(copy.filter((elem) => elem !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend.id]);
    }
  };
  return (
    <div
      className={
        'user-small-card ' +
        (selectedFriends.includes(friend.id) ? 'selected' : '')
      }
      onClick={() => handleOnClick()}
    >
      <img src={friend.avatar} className="avatar-sm" alt="avatar" />
      <div>
        <p>{friend.name}</p>
      </div>
			<div/>
    </div>
  );
};

export default UserSmallCard;
