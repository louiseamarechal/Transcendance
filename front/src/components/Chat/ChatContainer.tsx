import { useState } from 'react';
import { useChatContext } from '../../hooks/useChatContext';
import '../../style/components/chat/chat-container.css';
import ChatMessaging from './ChatContainer/ChatMessaging';
import CreateChannelForm from './ChatContainer/CreateChannelForm';

const ChatContainer = () => {
  const { showChannel, showCreateChannel } = useChatContext();
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className="chat-container">
      {showCreateChannel ? (
        <CreateChannelForm />
      ) : !Number.isNaN(showChannel) ? (
        <ChatMessaging
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default ChatContainer;
