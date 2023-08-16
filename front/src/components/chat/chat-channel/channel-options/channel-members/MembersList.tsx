import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Channel } from '../../../../../types/Channel.type';
import { User } from '../../../../../types/User.type';
import useChannel from '../../../../../hooks/useChannel';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import MemberOptionsCard from './components/MemberOptionsCard';
import AddMemberList from './components/AddMemberList';

export default function MembersList() {
  const channelState = useChannel();
  const [members, setMembers] = useState<{ user: User }[]>(
    channelState.self.members.map((m) => {
      return {
        user: m.user,
      };
    }),
  );
  const [admins, setAdmins] = useState<{ userId: number }[]>(
    channelState.self.admins,
  );
  const [showAddMember, setShowAddMember] = useState<boolean>(false);

  useEffect(() => {
    const updatedChannel: Channel = { ...channelState.self, members };
    channelState.reset(updatedChannel);
  }, [members]);
  useEffect(() => {
    const updatedChannel: Channel = { ...channelState.self, admins };
    channelState.reset(updatedChannel);
  }, [admins]);

  if (showAddMember) {
    return (
      <AddMemberList
        memberIds={members.map((m) => m.user.id)}
        setShowAddMember={setShowAddMember}
      />
    );
  } else {
    return (
      <ul className={'member-list'}>
        {channelState.self.members.map((member) => {
          return (
            <li key={`member-list-${member.user.id}`}>
              <MemberOptionsCard
                key={`member-list-card-${member.user.id}`}
                member={member.user}
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
}
