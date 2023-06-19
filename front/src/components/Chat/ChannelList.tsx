import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../style/components/chat/channel-list.css';
import ChannelCard from './ChannelCard';

const ChannelList = () => {
  const [channelList, setChannelList] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate
      .get('channel/myChannels')
      .then((res) => {
        setChannelList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          {channelList.map(
            (elem: { id: number; name: string; avatar: string }) => {
              return ChannelCard(elem.id, elem.name);
            },
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChannelList;
