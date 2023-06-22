import { useChatContext } from '../../hooks/useChatContext';
import ChannelList from './ChannelNav/ChannelList';
import '../../style/components/chat/channel-nav.css';

function ChannelNav() {
  const { showCreateChannel, setShowCreateChannel } = useChatContext();

  return (
    <div className="channel-nav">
      <button
        className="small-button"
        id="create-channel"
        onClick={() => {
          if (!showCreateChannel) {
            setShowCreateChannel(true);
          }
        }}
      >
        new group chat
      </button>
      <ChannelList />
    </div>
  );
}

export default ChannelNav;
