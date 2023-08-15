import { useChatContext } from '../../hooks/useChannelList';
import '../../style/components/chat/chat-container.css';
import ChatMessaging from './ChatContainer/ChatMessaging';
import CreateChannelForm from './ChatContainer/CreateChannelForm';

const ChatContainer = () => {
  const { showChannel, showCreateChannel } = useChatContext();

  return (
    <div className="chat-container">
      {showCreateChannel ? (
        <CreateChannelForm key={`create-channel-form`} />
      ) : !Number.isNaN(showChannel) ? (
        <ChatMessaging key={`Messaging-${showChannel}`} />
      ) : (
        <div />
      )}
    </div>
  );
};

export default ChatContainer;
