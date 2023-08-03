import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import '../../../../style/components/chat/chat-container/create-channel-form/friends-list.css';
import '../../../../../style/components/buttons.css';
import UserSmallCard from '../../CreateChannelForm/FriendsList/UserSmallCard';
import { User } from '../../../../../types/User.type';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import { Channel } from '../../../../../types/Channel.type';

const AddMemberList = ({
  members,
  setShowAddMember,
  channel,
  setChannel,
}: {
  members: { user: User }[];
  setShowAddMember: Dispatch<SetStateAction<boolean>>;
  channel: Channel;
  setChannel: Dispatch<SetStateAction<Channel>>;
}) => {
  const [friends, setFriends] = useState<
    { id: number; name: string; level: number; avatar: string }[]
  >([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const memberIds: number[] = members.map((member) => member.user.id);
  const axiosPrivate = useAxiosPrivate();

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

  async function addMembers() {
    if (selectedMembers.length !== 0) {
      await axiosPrivate.post(`channel/members/${channel.id}`, {
        ids: selectedMembers,
      });
      axiosPrivate.get('channel/' + channel.id).then((res) => {
        setChannel(res.data);
      });
    }
    setShowAddMember(false);
  }

  return (
    <div className="add-member-list">
      <p>Choose friends to add to channel</p>
      <div className="scrollable-list">
        <ul /*className="dual-column"*/>
          {friends.map(
            (friend: {
              id: number;
              name: string;
              avatar: string;
              level: number;
            }) => {
              if (memberIds.includes(friend.id)) {
                return <></>;
              } else {
                return (
                  <li key={`add-friend-${friend.id}`}>
                    <UserSmallCard
                      key={`user-card-${friend.id}`}
                      friend={friend}
                      selectedFriends={selectedMembers}
                      setSelectedFriends={setSelectedMembers}
                    />
                  </li>
                );
              }
            },
          )}
        </ul>
      </div>
      <button className="small-button" onClick={() => addMembers()}>
        Add
      </button>
    </div>
  );
};

export default AddMemberList;
