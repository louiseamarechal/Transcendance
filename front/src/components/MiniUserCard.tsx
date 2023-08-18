import { User } from '../types/User.type';
import Avatar from './Avatar';

type MiniUserCardProps = {
  user: User;
  selected: boolean;
};

function MiniUserCard({ user, selected = false }: MiniUserCardProps) {
  let style = 'w-28 h-28 flex-col-center';
  if (selected) {
    style += ' border-2 border-pink-500';
  }

  return (
    <div className={style}>
      <div>{user.name}</div>
      <Avatar id={user.id} />
    </div>
  );
}

export default MiniUserCard;
