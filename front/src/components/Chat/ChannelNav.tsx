import { useChatContext } from '../../hooks/useChatContext';
import ChannelList from './ChannelNav/ChannelList';
import '../../style/components/chat/channel-nav.css';
import { ChannelShort } from '../../types/Channel.type';
import { useNavigate } from 'react-router-dom';

type ChannelNavProps = {
  channelList: ChannelShort[];
};

function ChannelNav({ channelList }: ChannelNavProps) {
  // const { showCreateChannel, setShowCreateChannel, setShowChannel } =
  //   useChatContext();
  const navigate = useNavigate();
  return (
    <div className="channel-nav">
      <button
        className="small-button"
        id="create-channel"
        onClick={() => navigate('create')}
        // if (!showCreateChannel) {
        //   setShowCreateChannel(true);
        //   setShowChannel(NaN);
        // }
        // }}
      >
        new group chat
      </button>
      <ChannelList channelList={channelList}/>
    </div>
  );
}

export default ChannelNav;
