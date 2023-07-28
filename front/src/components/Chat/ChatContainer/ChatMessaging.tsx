import { useChatContext } from '../../../hooks/useChatContext';
import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';
import ChatHeader from './ChatMessaging/ChatHeader';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';
import ChatBody from './ChatMessaging/ChatBody';
import { channelSocket } from '../../../api/socket';
import ChatOptions from './ChatMessaging/ChatOptions';

const ChatMessaging = () => {
  const axiosInstance = useAxiosPrivate();
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<Channel>();
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get('channel/' + showChannel).then((res) => {
      setChannel(res.data);
      channelSocket.emit('client.channel.createRoom', res.data.id);
    });

    return () => {
      channelSocket.emit('client.channel.leaveRoom');
    };
  }, [showChannel]);

  return (
    <div className="chat-messaging">
      {channel ? (
        <ChatHeader
          key={channel.id}
          channel={channel}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      ) : (
        <></>
      )}
      {channel ? (
        showOptions ? (
          <ChatOptions channel={channel} />
        ) : (
          <ChatBody channel={channel} />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatMessaging;
