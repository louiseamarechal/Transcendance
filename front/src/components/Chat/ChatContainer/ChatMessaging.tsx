import { useChatContext } from '../../../hooks/useChatContext';
import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';
import ChatHeader from './ChatMessaging/ChatHeader';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';
import ChatBody from './ChatMessaging/ChatBody';
import ChatOptions from './ChatMessaging/ChatOptions';

const ChatMessaging = () => {
  const axiosInstance = useAxiosPrivate();
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<Channel>();
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    const getChannelData = async () => {
      const res: {data: Channel} = await axiosInstance.get('channel/' + showChannel);
			console.log({res});
      setChannel(res.data);
			console.log("set channel data: " + res.data.name);
    };
		getChannelData();
    console.log(`Loading channel ${showChannel} data`);
  }, [showChannel]);

  return (
    <div className="chat-messaging">
      {channel ? (
        <ChatHeader
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
