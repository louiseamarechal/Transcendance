import { Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCrack, faMedal } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../../../../../types/User.type';
import { Channel } from '../../../../../../../types/Channel.type';
import { axiosPrivate } from '../../../../../../../api/axios';

function PromoteButton({
  user,
  userRole,
  setUserRole,
  myRole,
  channel,
  setAdmins,
}: {
  user: User;
  userRole: number;
  setUserRole: Dispatch<SetStateAction<number>>;
  myRole: number;
  channel: Channel;
  setAdmins: Dispatch<SetStateAction<{ userId: number }[]>>;
}) {
  async function promote() {
    await axiosPrivate.post(`channel/admin/${channel.id}`, {
      userId: user.id,
    });
    const updatedAdmins: { userId: number }[] = [
      ...channel.admins,
      { userId: user.id },
    ];
    setAdmins(updatedAdmins);
    setUserRole(userRole + 1);
  }
  async function demote() {
    await axiosPrivate.delete(`channel/admin/${channel.id}`, {
      data: { userId: user.id },
    });
    const updatedAdmins: { userId: number }[] = channel.admins.filter(
      (adminUser: { userId: number }) => {
        if (adminUser.userId === user.id) {
          return false;
        } else {
          return true;
        }
      },
    );
    setAdmins(updatedAdmins);
    setUserRole(userRole - 1);
  }
  if (userRole === 0 && userRole < myRole) {
    return (
      <div className="option-button" onClick={() => promote()}>
        <FontAwesomeIcon icon={faMedal} style={{ color: 'green' }} />
      </div>
    );
  } else if (userRole === 1 && myRole === 2) {
    return (
      <div className="option-button" onClick={() => demote()}>
        <FontAwesomeIcon icon={faHeartCrack} style={{ color: 'red' }} />
      </div>
    );
  } else {
    return <></>;
  }
}

export default PromoteButton;
