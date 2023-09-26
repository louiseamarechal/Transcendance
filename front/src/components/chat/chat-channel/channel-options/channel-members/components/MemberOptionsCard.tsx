import { Dispatch, SetStateAction, useState } from 'react';
import { useUser } from '../../../../../../hooks/useUser';
import UserCard from '../../../../../ui/UserCard';
import PromoteButton from './components/PromoteButton';
import KickButton from './components/KickButton';
import BlockButton from './components/BlockButton';
import useChannel from '../../../../../../hooks/useChannel';
import { PublicUser } from '../../../../../../../../shared/common/types/user.type';
import GameRequestButton from './components/GameRequestButton';
import { useSearchParams } from 'react-router-dom';

function MemberOptionsCard({
  member,
  setAdmins,
  members,
  setMembers,
}: {
  member: PublicUser;
  setAdmins: Dispatch<SetStateAction<{ userId: number }[]>>;
  members: { user: PublicUser }[];
  setMembers: Dispatch<SetStateAction<{ user: PublicUser }[]>>;
}) {
  const channelState = useChannel();
  const { myId } = useUser();
  const myRole: number = determineRole(myId);
  const [userRole, setUserRole] = useState<number>(determineRole(member.id));
  const [searchParams] = useSearchParams();
  const isDM: boolean = searchParams.get('isDM') === 'true';

  function determineRole(id: number): number {
    const adminIds: number[] = channelState.self.admins.map(
      (adminUser: { userId: number }): number => {
        return adminUser.userId;
      },
    );
    if (id === channelState.self.ownerId) {
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
          {isDM ? (
            <div />
          ) : (
            <>
              <PromoteButton
                key={`option-${member.id}-promote`}
                user={member}
                userRole={userRole}
                setUserRole={setUserRole}
                myRole={myRole}
                setAdmins={setAdmins}
              />
              <KickButton
                key={`option-${member.id}-kick`}
                user={member}
                userRole={userRole}
                myRole={myRole}
                members={members}
                setMembers={setMembers}
              />
              <BlockButton
                key={`option-${member.id}-block`}
                user={member}
                userRole={userRole}
                myRole={myRole}
                members={members}
                setMembers={setMembers}
              />
            </>
          )}
          <GameRequestButton key={`option-${member.id}-game`} user={member} />
        </div>
      )}
      <div />
    </div>
  );
}

export default MemberOptionsCard;
