import { SetStateAction } from 'react';
import '../../../../style/components/chat/chat-container/create-channel-form/form-header.css';
import Avatar from '../../../Avatar';

const FormHeader = ({
  avatar,
  setAvatar,
  setChannelName,
}: {
  avatar: string;
  setAvatar: React.Dispatch<SetStateAction<string>>;
  setChannelName: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  async function changeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    setAvatar(event.target.value);
  }
  return (
    <div className="form-header">
      <div className="avatar-wrapper">
        <Avatar file={avatar} small={true} />
        <input
          type="file"
          onChange={(event) => changeAvatar(event)}
          className="avatar-sm form-avatar"
        ></input>
      </div>
      <input
        className="channel-name"
        placeholder="Channel name..."
        onChange={(event) => setChannelName(event.target.value)}
      ></input>
    </div>
  );
};

export default FormHeader;
