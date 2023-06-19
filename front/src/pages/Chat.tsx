import React, { useState } from 'react';
import ChannelNav from '../components/Chat/ChannelNav.tsx';
import ChatContainer from '../components/Chat/ChatContainer.tsx';
import '../style/pages/Chat.css';

function Chat() {
  const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);
  const [showChannel, setShowChannel] = useState<Number>(NaN);
  return (
    <>
      <div className="h-screen chat-page">
        <ChannelNav
          showChannel={showChannel}
          setShowChannel={setShowChannel}
          showCreateChannel={showCreateChannel}
          setShowCreateChannel={setShowCreateChannel}
        />
        <div id="chat-net"></div>
        <ChatContainer />
      </div>
    </>
  );
};

export default Chat;
