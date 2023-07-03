import { Channel } from '../../../../types/Channel.type';

const ChatHeader = ({ channel }: { channel: Channel }) => {
  return (
    <div className="chat-header">
      <img src={channel.avatar} />
    </div>
  );
};

export default ChatHeader;
