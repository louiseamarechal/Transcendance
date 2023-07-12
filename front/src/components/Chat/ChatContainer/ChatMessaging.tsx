import { useChatContext } from '../../../hooks/useChatContext';
import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';
import ChatHeader from './ChatMessaging/ChatHeader';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';

function ChatMessaging() {
  const axiosInstance = useAxiosPrivate();
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    axiosInstance.get('channel:' + showChannel).then((res) => {
      setChannel(res.data);
    });
  }, [showChannel]);

  return (
    <div className="chat-messaging">
      {channel ? <ChatHeader channel={channel} /> : <></>}
      {/* <ChatBody /> */}
    </div>
  );
}

export default ChatMessaging;
