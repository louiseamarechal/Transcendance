import { useChatContext } from '../../../hooks/useChatContext';
import { useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';

type ChannelType = {
  id: number;
  name: string;
  avatar: string;
};

const ChatMessaging = () => {
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<ChannelType>();
  return (
    <div className="chat-messaging">
      <ChatHeader />
      {/* <ChatBody /> */}
    </div>
  );
};

export default ChatMessaging;
