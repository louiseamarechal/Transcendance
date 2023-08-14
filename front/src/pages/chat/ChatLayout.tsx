import { useEffect, useState } from 'react';
import ChannelNav from '../../components/Chat/ChannelNav';
// import ChatContainer from '../../components/Chat/ChatContainer';
import { ChannelShort } from '../../types/Channel.type';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Outlet } from 'react-router-dom';

export default function ChatLayout() {
  const [channelList, setChannelList] = useState<ChannelShort[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate
      .get('channel/my-channels')
      .then((res) => {
        setChannelList(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  return (
    <div className="flex">
      {/* <div className="chat-page"> */}
      <div className="flex-1">
        <ChannelNav channelList={channelList} />
      </div>
      {/* <div id="chat-net"></div> */}
      {/* <div className='flex-shrink h-full w-[5px] border-[4px] border-black border-dashed'></div> */}
      {/* <div className="border-[6px] border-dashed border-[#1d1d1b80] rounded-full flex-shrink h-[90%]"></div> */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
