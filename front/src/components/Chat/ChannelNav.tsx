import ChannelList from './ChannelList';
import '../../style/components/chat/channel-nav.css';

const ChannelNav = ({
  showChannel,
  setShowChannel,
  showCreateChannel,
  setShowCreateChannel,
}) => {
  return (
    <div className="channel-nav">
      <button
        className="small-button"
        id="create-channel"
        onClick={() => {
          if (!showCreateChannel) setShowCreateChannel(true);
        }}
      >
        new group chat
      </button>
      <ChannelList showChannel={showChannel} setShowChannel={setShowChannel}/>
    </div>
  );
};

export default ChannelNav;
