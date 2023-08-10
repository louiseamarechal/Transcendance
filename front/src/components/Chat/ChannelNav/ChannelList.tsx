import { useEffect } from 'react';
import '../../../style/components/chat/channel-nav/channel-list.css';
import '../../../style/components/buttons.css';
import { Link } from 'react-router-dom';
import ChannelCard from './ChannelList/ChannelCard';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Channel } from '../../../types/Channel.type';
import { useChatContext } from '../../../hooks/useChatContext';
import { useUser } from '../../../hooks/useUser';

const ChannelList = () => {
  const axiosPrivate = useAxiosPrivate();
  const { myId } = useUser();
  const { channelList, setChannelList } = useChatContext();

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
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          <li>
            <Link to={'/FindFriends'}>
              <p className="text-center">Add friend</p>
            </Link>
          </li>
          <li>
            <p className='text-center'>Your channels</p>
          </li>
          {channelList
            .filter((elem: Channel) => {
              return elem.members.includes({ userId: myId });
            })
            .map((elem: Channel) => {
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
            <li>
              <p className='text-center'>Channels you can join</p>
            </li>
            {channelList
            .filter((elem: Channel) => {
              return !elem.members.includes({ userId: myId });
            })
            .map((elem: Channel) => {
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
