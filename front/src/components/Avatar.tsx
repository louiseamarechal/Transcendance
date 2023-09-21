import BACK_URL from '../api/backUrl';

type AvatarProps = {
  id?: number;
  file?: string;
  small?: boolean;
};

export default function Avatar({ id, file, small }: AvatarProps) {
  let url: string;

  if (id) {
    url = `${BACK_URL}/user/avatarById/${id}?random=${Math.random()}`;
  } else if (file) {
    url = `${BACK_URL}/user/avatarByFile/${file}?random=${Math.random()}`;
  } else {
    return null;
  }

  return (
    <img className={`avatar${small ? '-sm' : ''}`} alt="avatar" src={url} />
  );
}
