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

const MembersList = ({
  users,
  ownerId,
  admins,
}: {
  users: { user: User }[];
  ownerId: number;
  admins: { user: User }[];
}) => {
  // const role: string = ;
  const axiosPrivate = useAxiosPrivate();

  function PromoteButton({ user }: { user: User }) {
    async function promote() {}
    return (
      <div className="option-button" onClick={() => promote()}>
        <FontAwesomeIcon icon={faMedal} style={{ color: 'green' }} />
      </div>
    );
  }

  function MuteButton(user: User) {
    function mute() {}
    return (
      <div className="option-button" onClick={() => mute()}>
        <FontAwesomeIcon icon={faVolumeXmark} style={{ color: 'grey' }} />
      </div>
    );
  }

  function KickButton(user: User) {
    function kick() {}
    return (
      <div className="option-button" onClick={() => kick()}>
        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'black' }} />
      </div>
    );
  }

  function BanButton(user: User) {
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
                <PromoteButton user={member} />
                <MuteButton user={member} />
                <KickButton user={member} />
                <BanButton user={member} />
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
