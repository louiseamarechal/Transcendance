import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../style/components/chat/channel-list.css';
import ChannelCard from './ChannelCard';

function ChannelList(showChannel: number, setShowChannel: (_: number) => any) {
  const axiosPrivate = useAxiosPrivate();
  const response: Promise<[]> = axiosPrivate.get('channel/myChannels');
  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          response.map();
        </ul>
      </div>
    </div>
  );
}

export default ChannelList;
