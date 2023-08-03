import { Dispatch, SetStateAction, useState } from 'react';
import { useUser } from '../../../../../../hooks/useUser';
import { Channel } from '../../../../../../types/Channel.type';
import { User } from '../../../../../../types/User.type';
import UserCard from '../../../../../UserCard';
import PromoteButton from './OptionButtons/PromoteButton';
import MuteButton from './OptionButtons/MuteButton';
import KickButton from './OptionButtons/KickButton';
import BlockButton from './OptionButtons/BlockButton';

function MemberOptionsCard({
  member,
  channel,
  setAdmins,
  members,
  setMembers,
}: {
  member: User;
  channel: Channel;
  setAdmins: Dispatch<SetStateAction<{ userId: number }[]>>;
  members: { user: User }[];
  setMembers: Dispatch<SetStateAction<{ user: User }[]>>;
}) {
  const { myId } = useUser();
  const myRole: number = determineRole(myId);
  const [userRole, setUserRole] = useState<number>(determineRole(member.id));

  function determineRole(id: number): number {
    const adminIds: number[] = channel.admins.map(
      (adminUser: { userId: number }): number => {
        return adminUser.userId;
      },
    );
    if (id === channel.ownerId) {
      return 2; // OWNER
    } else if (adminIds.includes(id)) {
      return 1; // ADMIN
    } else {
      return 0; // MEMBER
    }
  }

  return (
    <div className="card">
      <UserCard key={`option-member-${member.id}`} user={member} />
      {member.id === myId ? (
        <div />
      ) : (
        <div className="action-buttons">
          <PromoteButton
            key={`option-${member.id}-promote`}
            user={member}
            userRole={userRole}
            setUserRole={setUserRole}
            myRole={myRole}
            channel={channel}
            setAdmins={setAdmins}
          />
          <MuteButton
            key={`option-${member.id}-mute`}
            user={member}
            channel={channel}
          />
          <KickButton
            key={`option-${member.id}-kick`}
            user={member}
            userRole={userRole}
            myRole={myRole}
            channel={channel}
            members={members}
            setMembers={setMembers}
          />
          <BlockButton
            key={`option-${member.id}-block`}
            user={member}
            userRole={userRole}
            myRole={myRole}
            channel={channel}
            members={members}
            setMembers={setMembers}
          />
        </div>
      )}
      <div />
    </div>
  );
}

export default MemberOptionsCard;
