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

const MembersList = ({ users }: { users: { user: User }[] }) => {
  return (
    <ul>
      {users.map((member) => {
        console.log({ member });
        return (
          <li key={member.user.id}>
            <div className="card">
              <UserCard user={member.user} />
              <div className="action-buttons">
                <div className="option-button">
                  <FontAwesomeIcon
                    icon={faMedal}
                    style={{ color: 'green' }}
                  />
                </div>
                <div className="option-button">
                  <FontAwesomeIcon
                    icon={faVolumeXmark}
                    style={{ color: 'grey' }}
                  />
                </div>
                <div className="option-button">
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    style={{ color: 'black' }}
                  />
                </div>
                <div className="option-button">
                  <FontAwesomeIcon
                    icon={faSkullCrossbones}
                    style={{ color: 'red' }}
                  />
                </div>
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
