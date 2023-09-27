import { Dispatch, SetStateAction } from 'react';
import { axiosPrivate } from '../../../../../../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import useChannel from '../../../../../../../hooks/useChannel';
import { PublicUser } from '../../../../../../../../../shared/common/types/user.type';

function KickButton({
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

  async function kick() {
    const res = await axiosPrivate
      .delete(`channel/member/${channelState.self.id}/${user.id}`)
      .catch((e) => {
        if (e.response.status === 409) {
          alert('User already removed.');
          setMembers(
            members.filter((memberUser: { user: PublicUser }) => {
              if (memberUser.user.id === user.id) {
                return false;
              } else {
                return true;
              }
            }),
          );
        } else {
          console.error(e);
        }
        return;
      });
    const DeletedMemberOnChannel: { userId: number; channelId: number } =
      res?.data;
    console.log(`kick member: ${DeletedMemberOnChannel.userId}`);
    if (DeletedMemberOnChannel !== undefined) {
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
      <div className="option-button" onClick={() => kick()}>
        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'black' }} />
      </div>
    );
  } else {
    return <></>;
  }
}

export default KickButton;
