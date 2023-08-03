import BACK_URL from '../api/backUrl';

type AvatarProps = {
  id?: number;
  file?: string;
};

export default function Avatar({ id, file }: AvatarProps) {
  if (id) {
    return (
      <img
        className="avatar"
        alt="avatar"
        src={`${BACK_URL}/user/avatarById/${id}`}
      />
    );
  }

  if (file) {
    console.log(file);

    return (
      <img
        className="avatar"
        alt="avatar"
        src={`${BACK_URL}/user/avatarByFile/${file}`}
      />
    );
  }

  return null;
}
