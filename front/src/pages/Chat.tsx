// import React from 'react'
import ChannelNav from "../components/Chat/ChannelNav.tsx";
import ChatContainer from "../components/Chat/ChatContainer.tsx";
import NavBar from "../components/NavBar.tsx";
import "../style/pages/Chat.css";

function Chat() {
  return (
    <>
      <div className="h-screen chat-page">
        <ChannelNav />
        <div id="chat-net"></div>
        <ChatContainer />
      </div>
    </>
  );
}

export default Chat;
