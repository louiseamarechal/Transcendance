import UserCard from '../../../../UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeXmark,
  faSkullCrossbones,
  faThumbsDown,
  faMedal,
  faHeartCrack,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import { User } from '../../../../../types/User.type';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import { useUser } from '../../../../../hooks/useUser';
import { useChatContext } from '../../../../../hooks/useChatContext';
import { useEffect, useState } from 'react';

const MembersList = ({
  users,
  ownerId,
  admins,
}: {
  users: { user: User }[];
  ownerId: number;
  admins: { userId: number }[];
}) => {
  const { showChannel, setShowChannel } = useChatContext();
  const { myId } = useUser();
  const myRole: number = determineRole(myId);
  const axiosPrivate = useAxiosPrivate();
  const [_, setRefresh] = useState<boolean>(false);

  function determineRole(id: number): number {
    const adminIds: number[] = admins.map(
      (adminUser: { userId: number }): number => {
        return adminUser.userId;
      },
    );
    if (id === ownerId) {
      return 2; // OWNER
    } else if (adminIds.includes(id)) {
      return 1; // ADMIN
    } else {
      return 0; // MEMBER
    }
  }

  function PromoteButton({ user }: { user: User }) {
    let userRole: number = determineRole(user.id);
    async function promote() {
      await axiosPrivate.post(`channel/admin/${showChannel}`, {
        userId: user.id,
      });
      userRole += 1;
      setRefresh(true);
    }
    async function demote() {
      await axiosPrivate.delete(`channel/admin/${showChannel}`, {
        data: { userId: user.id },
      });
      userRole -= 1;
      setRefresh(true);
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

  function MuteButton({ user }: { user: User }) {
    const [muted, setMuted] = useState<boolean>(false);
    useEffect(() => {
      axiosPrivate
        .get(`channel/muted/${showChannel}/${user.id}`)
        .then((res) => {
          console.log({ res });
          if (res.data !== '') {
            setMuted(true);
          }
        });
    });
    console.log(`muted: ${muted}`);
    async function mute() {
      console.log(`I ${myId}, want to mute ${user.id}`);
      await axiosPrivate
			.post(`channel/muted/${showChannel}`, { mutedId: user.id })
			.then(() => {
				setMuted(true);
			})
			.catch((e) => {
				if (e.response.status !== 409) {
					throw e;
				}
			});
    }
    async function unmute() {
			console.log(`I ${myId}, want to unmute ${user.id}`);
      await axiosPrivate
        .delete(`channel/muted/${showChannel}/${user.id}`)
        .then(() => {
          setMuted(false);
        })
        .catch((e) => {
          if (e.response.status !== 409) {
            throw e;
          }
        });
    }
    if (muted) {
      return (
        <div className="option-button" onClick={() => unmute()}>
          <FontAwesomeIcon icon={faVolumeXmark} style={{ color: 'grey' }} />
        </div>
      );
    } else {
      return (
        <div className="option-button" onClick={() => mute()}>
          <FontAwesomeIcon icon={faVolumeHigh} style={{ color: 'grey' }} />
        </div>
      );
    }
  }

  function KickButton({ user }: { user: User }) {
    const userRole = determineRole(user.id);
    function kick() {
      axiosPrivate.delete(`channel/member/${showChannel}/${user.id}`);
      setShowChannel(showChannel);
    }
    return (
      <div className="option-button" onClick={() => kick()}>
        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'black' }} />
      </div>
    );
  }

  function BanButton({ user }: { user: User }) {
    const userRole = determineRole(user.id);
    function ban() {}
    return (
      <div className="option-button" onClick={() => ban()}>
        <FontAwesomeIcon icon={faSkullCrossbones} style={{ color: 'red' }} />
      </div>
    );
  }

  return (
    <ul>
      {users.map((member) => {
        return (
          <li key={member.user.id}>
            <div className="card">
              <UserCard user={member.user} />
              <div className="action-buttons">
                <PromoteButton user={member.user} />
                <MuteButton user={member.user} />
                <KickButton user={member.user} />
                <BanButton user={member.user} />
              </div>
              <div />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MembersList;
