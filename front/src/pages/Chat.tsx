import { ChatProvider } from '../context/ChatProvider.tsx';
import ChannelNav from '../components/Chat/ChannelNav.tsx';
import ChatContainer from '../components/Chat/ChatContainer.tsx';
import '../style/pages/Chat.css';
import { useEffect } from 'react';
import { channelSocket } from '../api/socket.ts';
import useAuth from '../hooks/useAuth';

function Chat() {
  const { auth } = useAuth();

  useEffect(() => {
    channelSocket.auth = {
      token: auth.access_token,
    }

    channelSocket.connect()
    return () => {
      channelSocket.disconnect();
    };
  }, [auth]);
  
  return (
    <ChatProvider>
      <div className="chat-page">
        <ChannelNav />
        <div id="chat-net"></div>
        <ChatContainer />
      </div>
    </ChatProvider>
  );
}

export default Chat;
