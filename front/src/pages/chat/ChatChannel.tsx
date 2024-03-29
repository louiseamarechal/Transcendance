import { useEffect } from 'react';
import '../../style/components/chat/chat-container/chat-messaging.css';
import { Outlet, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { channelSocket } from '../../api/socket';
import useChannel from '../../hooks/useChannel';
import ChatHeader from '../../components/chat/chat-channel/ChatHeader';

export default function ChatChannel() {
  const axiosInstance = useAxiosPrivate();
  const channelState = useChannel();
  const routeParams = useParams();
  const channelId: number = Number(routeParams.channelId);

  useEffect(() => {
    axiosInstance.get(`channel/${channelId}`).then((res) => {
      console.log({ data: res.data });
      channelState.reset(res.data);
      channelSocket.emit('client.channel.createRoom', res.data.id);
    });
    return () => {
      channelSocket.emit('client.channel.leaveRoom');
    };
  }, [channelId]);

  return (
    <div className="chat-messaging">
      <ChatHeader key={`header-chat-${channelState.self.id}`} />
      <Outlet key={`channel-${channelId}`} />
    </div>
  );
}
