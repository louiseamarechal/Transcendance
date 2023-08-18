import BACK_URL from '../api/backUrl';

type AvatarProps = {
  id?: number;
  file?: string;
  selected?: boolean;
};

export default function Avatar({ id, file, selected = false }: AvatarProps) {
  let className = 'avatar';
  if (selected) {
    className += ' border-pink-500';
  }

  if (id) {
    return (
      <img
        className={className}
        alt="avatar"
        src={`${BACK_URL}/user/avatarById/${id}`}
      />
    );
  }

  if (file) {
    console.log(file);

    return (
      <img
        className={className}
        alt="avatar"
        src={`${BACK_URL}/user/avatarByFile/${file}`}
      />
    );
  }

  return null;
}
