import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../style/components/chat/channel-list.css';
import '../../style/components/buttons.css';
import ChannelCard from './ChannelCard';
import { Link } from 'react-router-dom';

const ChannelList = () => {
  const [channelList, setChannelList] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);
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
              <Link to={'/friends'}><p className='text-center'>Add friend</p></Link>
            </li>
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
