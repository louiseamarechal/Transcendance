import { useEffect } from 'react';
import '../../../style/components/chat/channel-nav/channel-list.css';
import '../../../style/components/buttons.css';
import { Link } from 'react-router-dom';
import ChannelCard from './ChannelList/ChannelCard';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';
import { useChatContext } from '../../../hooks/useChatContext';

const ChannelList = () => {
  const axiosPrivate = useAxiosPrivate();
  const { channelList, setChannelList } = useChatContext();

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
    // axiosPrivate
  }, []);

  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          <li>
            <Link to={'/FindFriends'}>
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
