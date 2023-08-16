import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useChannelList from '../../hooks/useChannelList';
import ChannelNav from '../../components/chat/ChannelNav';
import '../../style/pages/Chat.css';

export default function ChatLayout() {
  const channelListState = useChannelList();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate
      .get('channel/my-channels')
      .then((res) => {
        channelListState.reset(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  return (
    <div className="chat-page">
      <ChannelNav />
      <div id="chat-net"></div>
      <Outlet />
    </div>
  );
}
