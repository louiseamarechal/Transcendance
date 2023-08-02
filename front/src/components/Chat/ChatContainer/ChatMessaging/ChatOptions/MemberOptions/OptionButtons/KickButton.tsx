import { Dispatch, SetStateAction } from 'react';
import { User } from '../../../../../../../types/User.type';
import { axiosPrivate } from '../../../../../../../api/axios';
import { Channel } from '../../../../../../../types/Channel.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function KickButton({
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
  async function kick() {
    const DeletedMemberOnChannel: { userId: number; channelId: number } =
      await axiosPrivate.delete(`channel/member/${channel.id}/${user.id}`);
    if (DeletedMemberOnChannel !== undefined) {
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
      <div className="option-button" onClick={() => kick()}>
        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'black' }} />
      </div>
    );
  } else {
    return <></>;
  }
}

export default KickButton;
