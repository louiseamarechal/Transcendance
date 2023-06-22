import { ChatProvider } from '../context/ChatProvider.tsx';
import ChannelNav from '../components/Chat/ChannelNav.tsx';
import ChatContainer from '../components/Chat/ChatContainer.tsx';
import '../style/pages/Chat.css';

function Chat() {

  return (
    <ChatProvider>
      <div className="chat-page">
        <ChannelNav />
        <div id="chat-net"></div>
        <ChatContainer />
      </div>
    </ChatProvider>
  );
};

export default Chat;
