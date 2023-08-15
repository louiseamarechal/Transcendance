import { useChatContext } from '../../../hooks/useChannelList';
import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';
import ChatHeader from './ChatMessaging/ChatHeader';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel, emptyChannel } from '../../../types/Channel.type';
import ChatBody from './ChatMessaging/ChatBody';
import { channelSocket } from '../../../api/socket';
import ChatOptions from './ChatMessaging/ChatOptions';

const ChatMessaging = () => {
  const axiosInstance = useAxiosPrivate();
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<Channel>(emptyChannel);
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

  console.log('messagin.');
  console.log({ channel });
  return (
    <div className="chat-messaging">
      {channel ? (
        <ChatHeader
          key={`header-chat-${channel.id}`}
          channel={channel}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      ) : (
        <></>
      )}
      {channel ? (
        showOptions ? (
          <ChatOptions
            key={`chat-options-${channel.id}`}
            channel={channel}
            setChannel={setChannel}
          />
        ) : (
          <ChatBody key={`chat-body-${channel.id}`} channel={channel} />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatMessaging;
