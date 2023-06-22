import { SetStateAction } from 'react';
import '../../../../style/components/chat/chat-container/create-channel-form/friends-list.css'
import UserSmallCard from './FriendsList/UserSmallCard';

const FriendsList = ({friends, selectedFriends, setSelectedFriends}: 
	{
		friends: { id: number; name: string; level: number; avatar: string }[],
    selectedFriends: number[],
    setSelectedFriends: React.Dispatch<SetStateAction<number[]>>,
	}
) => {
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
                return UserSmallCard(friend);
              },
            )}
          </ul>
        </div>
      </div>
	);
}

export default FriendsList