import { User } from '../../../../../types/User.type';
import UserCard from '../../../../UserCard';

const MembersList = ({ users }: { users: { user: User }[] }) => {
  return (
    <ul>
      {users.map((member) => {
        console.log({ member });
        return (
          <li key={member.user.id}>
            <div className="channel-cards">
              <UserCard user={member.user} />
							<div className="action-buttons"></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MembersList;
