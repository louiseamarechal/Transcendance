import { useChatContext } from '../../hooks/useChatContext';
import '../../style/components/chat/chat-container.css';
import ChatMessaging from './ChatMessaging';
import CreateChannelForm from './CreateChannelForm';

const ChatContainer = () => {
  const { showChannel, showCreateChannel } = useChatContext();
  return <div className="chat-container">{
		showCreateChannel ? <CreateChannelForm /> : ( !Number.isNaN(showChannel) ? <ChatMessaging /> : <div />)
	}</div>;
};

export default ChatContainer;
