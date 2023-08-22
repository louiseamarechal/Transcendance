import BACK_URL from '../api/backUrl';

type AvatarProps = {
  id?: number;
  file?: string;
  small?: boolean;
};

export default function Avatar({ id, file, small }: AvatarProps) {
  if (id) {
    return (
      <img
        className={`avatar${small ? '-sm' : ''}`}
        alt="avatar"
        src={`${BACK_URL}/user/avatarById/${id}`}
      />
    );
  }

  if (file) {
    // console.log(file);

    return (
      <img
        className={`avatar${small ? '-sm' : ''}`}
        alt="avatar"
        src={`${BACK_URL}/user/avatarByFile/${file}`}
      />
    );
  }

  return null;
}
