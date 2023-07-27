import UserCard from '../../../../UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeXmark,
  faSkullCrossbones,
  faThumbsDown,
  faMedal,
  faHeartCrack,
} from '@fortawesome/free-solid-svg-icons';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import { User } from '../../../../../types/User.type';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import { useUser } from '../../../../../hooks/useUser';
import { useChatContext } from '../../../../../hooks/useChatContext';

const MembersList = ({
  users,
  ownerId,
  admins,
}: {
  users: { user: User }[];
  ownerId: number;
  admins: number[];
}) => {
  const {myId} = useUser();
  const {showChannel} = useChatContext();
  const myRole: number = determineRole(myId);
  const axiosPrivate = useAxiosPrivate();

  function determineRole(id: number): number {
    if (id === ownerId) {
      return 2 // OWNER
    } else if (admins.includes(id)) {
      return 1; // ADMIN
    } else {
      return 0; // MEMBER
    }
  }

  function PromoteButton({ user }: { user: User }) {
    const userRole: number = determineRole(user.id);
    async function promote() {
      await axiosPrivate.post(`admin/${showChannel}`, {userId: user.id});
    }
    async function demote() {
      await axiosPrivate.delete(`admin/${showChannel}`, {data: {userId: user.id}})
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
      )
    } else {
      return (<></>);
    }
  }

  function MuteButton({ user }: { user: User }) {
    const userRole = determineRole(user.id);
    function mute() {}
    return (
      <div className="option-button" onClick={() => mute()}>
        <FontAwesomeIcon icon={faVolumeXmark} style={{ color: 'grey' }} />
      </div>
    );
  }

  function KickButton({ user }: { user: User }) {
    const userRole = determineRole(user.id);
    function kick() {}
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
        console.log({ member });
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
