import { SetStateAction } from 'react';
import '../../../../style/components/chat/chat-container/create-channel-form/form-header.css'

const FormHeader = ({
  avatar,
  setAvatar,
  setChannelName,
}: {
  avatar: string;
  setAvatar: React.Dispatch<SetStateAction<string>>;
  setChannelName: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="form-header">
      <div className="avatar-wrapper">
        <img src={avatar} className="avatar-sm" />
        <input
          type="file"
          onChange={(event) => setAvatar(event.target.value)}
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
