import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../../../hooks/useAxiosPrivate';
import useChannel from '../../../../../../hooks/useChannel';
import UserSmallCard from '../../../../chat-create/components/UserSmallCard';
import '../../../../../../style/components/buttons.css';
import { PublicUser } from '../../../../../../../../shared/common/types/user.type';

export default function AddMemberList({
  memberIds,
  setShowAddMember,
  setMembers,
}: {
  memberIds: number[];
  setShowAddMember: Dispatch<SetStateAction<boolean>>;
  setMembers: Dispatch<SetStateAction<{ user: PublicUser }[]>>;
}) {
  const channelState = useChannel();
  const [friends, setFriends] = useState<
    { id: number; name: string; level: number; avatar: string }[]
  >([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
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
      await axiosPrivate.post(`channel/members/${channelState.self.id}`, {
        ids: selectedMembers,
      });
      axiosPrivate.get('channel/' + channelState.self.id).then((res) => {
        channelState.reset(res.data);
        setMembers(res.data.members);
      });
    }
    setShowAddMember(false);
  }

  return (
    <div className="add-member-list">
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
}
