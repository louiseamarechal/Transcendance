import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Channel } from '../../../../../../../types/Channel.type';
import { User } from '../../../../../../../types/User.type';
import { axiosPrivate } from '../../../../../../../api/axios';
import { Dispatch, SetStateAction } from 'react';

function BlockButton({
  user,
  userRole,
  myRole,
  channel,
  members,
  setMembers,
}: {
  user: User;
  userRole: number;
  myRole: number;
  channel: Channel;
  members: { user: User }[];
  setMembers: Dispatch<SetStateAction<{ user: User }[]>>;
}) {
  async function block() {
    const DeletedMemberOnChannel: { userId: number; channelId: number } = (
      await axiosPrivate.delete(`channel/member/${channel.id}/${user.id}`)
    ).data;
    const blockedUser = (
      await axiosPrivate.post(
        `channel/blocked/${channel.id}/${DeletedMemberOnChannel.userId}`,
      )
    ).data;
    if (blockedUser) {
      setMembers(
        members.filter((memberUser: { user: User }) => {
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
