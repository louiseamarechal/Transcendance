import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Channel } from '../../../../../types/Channel.type';
import AddMemberList from './AddMemberList';
import MemberOptionsCard from './MemberOptions/MemberOptionsCard';
import { User } from '../../../../../types/User.type';

const MembersList = ({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: Dispatch<SetStateAction<Channel | undefined>>;
}) => {
  const [members, setMembers] = useState<{ user: User }[]>(channel.members);
  const [admins, setAdmins] = useState<{ userId: number }[]>(channel.admins);
  const [showAddMember, setShowAddMember] = useState<boolean>(false);

  useEffect(() => {
    const updatedChannel: Channel = { ...channel, members };
    setChannel(updatedChannel);
  }, [members]);
  useEffect(() => {
    const updatedChannel: Channel = { ...channel, admins };
    setChannel(updatedChannel);
  }, [admins]);

  if (showAddMember) {
    return (
      <AddMemberList
        members={channel.members}
        setShowAddMember={setShowAddMember}
        channel={channel}
        setChannel={setChannel}
      />
    );
  } else {
    return (
      <ul>
        {channel.members.map((member) => {
          return (
            <li key={`member-list-${member.user.id}`}>
              <MemberOptionsCard
                key={`member-list-card-${member.user.id}`}
                member={member.user}
                channel={channel}
                setAdmins={setAdmins}
                members={members}
                setMembers={setMembers}
              />
            </li>
          );
        })}
        <li key={`add-member`}>
          <div className="add-member" onClick={() => setShowAddMember(true)}>
            <FontAwesomeIcon
              className="fa-3x"
              icon={faPlusCircle}
              style={{ color: 'black' }}
            />
          </div>
        </li>
      </ul>
    );
  }
};

export default MembersList;
