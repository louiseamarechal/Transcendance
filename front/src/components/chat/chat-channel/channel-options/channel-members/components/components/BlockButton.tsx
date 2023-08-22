import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { axiosPrivate } from '../../../../../../../api/axios';
import { Dispatch, SetStateAction } from 'react';
import useChannel from '../../../../../../../hooks/useChannel';
import { PublicUser } from '../../../../../../../../../shared/common/types/user.type';

function BlockButton({
  user,
  userRole,
  myRole,
  members,
  setMembers,
}: {
  user: PublicUser;
  userRole: number;
  myRole: number;
  members: { user: PublicUser }[];
  setMembers: Dispatch<SetStateAction<{ user: PublicUser }[]>>;
}) {
  const channelState = useChannel();
  async function block() {
    const DeletedMemberOnChannel: { userId: number; channelId: number } = (
      await axiosPrivate.delete(
        `channel/member/${channelState.self.id}/${user.id}`,
      )
    ).data;
    const blockedUser = (
      await axiosPrivate.post(
        `channel/blocked/${channelState.self.id}/${DeletedMemberOnChannel.userId}`,
      )
    ).data;
    if (blockedUser) {
      setMembers(
        members.filter((memberUser: { user: PublicUser }) => {
          if (memberUser.user.id === DeletedMemberOnChannel.userId) {
            return false;
          } else {
            return true;
          }
        }),
      );
    }
  }
  if (userRole < myRole) {
    return (
      <div className="option-button" onClick={() => block()}>
        <FontAwesomeIcon icon={faSkullCrossbones} style={{ color: 'red' }} />
      </div>
    );
  } else {
    return <></>;
  }
}

export default BlockButton;
