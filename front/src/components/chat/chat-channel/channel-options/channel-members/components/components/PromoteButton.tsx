import { Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCrack, faMedal } from '@fortawesome/free-solid-svg-icons';
import { axiosPrivate } from '../../../../../../../api/axios';
import useChannel from '../../../../../../../hooks/useChannel';
import { PublicUser } from '../../../../../../../../../shared/common/types/user.type';

function PromoteButton({
  user,
  userRole,
  setUserRole,
  myRole,
  setAdmins,
}: {
  user: PublicUser;
  userRole: number;
  setUserRole: Dispatch<SetStateAction<number>>;
  myRole: number;
  setAdmins: Dispatch<SetStateAction<{ userId: number }[]>>;
}) {
  const channelState = useChannel();
  async function promote() {
    await axiosPrivate.post(`channel/admin/${channelState.self.id}`, {
      userId: user.id,
    });
    const updatedAdmins: { userId: number }[] = [
      ...channelState.self.admins,
      { userId: user.id },
    ];
    setAdmins(updatedAdmins);
    setUserRole(userRole + 1);
  }
  async function demote() {
    await axiosPrivate.delete(`channel/admin/${channelState.self.id}`, {
      data: { userId: user.id },
    });
    const updatedAdmins: { userId: number }[] = channelState.self.admins.filter(
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
