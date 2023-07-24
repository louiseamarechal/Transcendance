import { useChatContext } from '../../../hooks/useChatContext';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/chat-messaging.css';
import ChatHeader from './ChatMessaging/ChatHeader';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';
import ChatBody from './ChatMessaging/ChatBody';

const ChatMessaging = ({
  showOptions,
  setShowOptions,
}: {
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}) => {
  const axiosInstance = useAxiosPrivate();
  const { showChannel } = useChatContext();
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    axiosInstance.get('channel/' + showChannel).then((res) => {
      setChannel(res.data);
    });
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
      {channel ? <ChatBody channel={channel} /> : <></>}
    </div>
  );
};

export default ChatMessaging;
