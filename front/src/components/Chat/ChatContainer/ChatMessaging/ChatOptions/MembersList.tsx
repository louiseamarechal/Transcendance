import UserCard from '../../../../UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeXmark,
  faSkullCrossbones,
  faThumbsDown,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import { User } from '../../../../../types/User.type';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import { useUser } from '../../../../../hooks/useUser';

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
  const role: string = determineRole();
  const axiosPrivate = useAxiosPrivate();

  function determineRole(): string {
    if (myId === ownerId) {
      return "OWNER";
    } else if (admins.includes(myId)) {
      return "ADMIN";
    } else {
      return "MEMBER";
    }
  }

  function PromoteButton({ user }: { user: User }) {
    async function promote() {}
    return (
      <div className="option-button" onClick={() => promote()}>
        <FontAwesomeIcon icon={faMedal} style={{ color: 'green' }} />
      </div>
    );
  }

  function MuteButton({ user }: { user: User }) {
    function mute() {}
    return (
      <div className="option-button" onClick={() => mute()}>
        <FontAwesomeIcon icon={faVolumeXmark} style={{ color: 'grey' }} />
      </div>
    );
  }

  function KickButton({ user }: { user: User }) {
    function kick() {}
    return (
      <div className="option-button" onClick={() => kick()}>
        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'black' }} />
      </div>
    );
  }

  function BanButton({ user }: { user: User }) {
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
