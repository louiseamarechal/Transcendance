import { useEffect, useState } from 'react';
import '../../../style/components/chat/channel-nav/channel-list.css';
import '../../../style/components/buttons.css';
import { Link } from 'react-router-dom';
import ChannelCard from './ChannelList/ChannelCard';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';

const ChannelList = () => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate
      .get('channel/my-channels')
      .then((res) => {
        console.log('Got response from GET channel/my-channels');
        console.log(res);
        setChannelList(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          <li>
            <Link to={'/friends'}>
              <p className="text-center">Add friend</p>
            </Link>
          </li>
          {channelList.map((elem: Channel) => {
            return (
              <li key={elem.id}>
                <ChannelCard
                  id={elem.id}
                  name={elem.name}
                  avatar={elem.avatar}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChannelList;
