import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useChannelList from '../../hooks/useChannelList';
import ChannelNav from '../../components/chat/ChannelNav';
import '../../style/pages/Chat.css';
import { channelSocket } from '../../api/socket';
import useAuth from '../../hooks/useAuth';

export default function ChatLayout() {
  const channelListState = useChannelList();
  const axiosPrivate = useAxiosPrivate();
  const [navChatOpen, setNavChatOpen] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    channelSocket.auth = { token: auth.access_token };
    channelSocket.connect();

    axiosPrivate
      .get('channel/my-channels')
      .then((res) => {
        channelListState.reset(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });

    return () => {
      channelSocket.disconnect();
    };
  }, [auth]);

    return (
      <div className="chat-page">
        <ChannelNav />
        <div id="chat-net"></div>
        <Outlet />
      </div>
    );

}
