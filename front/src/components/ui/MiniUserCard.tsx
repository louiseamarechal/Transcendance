import { PublicUser } from '../../../../shared/common/types/user.type';
import Avatar from './Avatar';

type MiniUserCardProps = {
  user: PublicUser;
  selected?: boolean;
};

function MiniUserCard({ user, selected = false }: MiniUserCardProps) {
  let style = 'w-28 h-28 flex-col-center';
  if (selected) {
    style += ' border-2 border-pink-500';
  } else {
    style += ' hover:border-2 hover:border-pink-200';
  }

  return (
    <div className={style}>
      <div>{user.name}</div>
      <Avatar id={user.id} />
    </div>
  );
}

export default MiniUserCard;
