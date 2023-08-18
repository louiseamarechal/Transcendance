import '../../style/components/chat/channel-nav.css';
import { useNavigate } from 'react-router-dom';
import ChannelList from './components/ChannelList';

function ChannelNav() {
  const navigate = useNavigate();
  return (
    <div className="channel-nav">
      <button
        className="small-button"
        id="create-channel"
        onClick={() => navigate('create')}
      >
        new group chat
      </button>
      <ChannelList />
    </div>
  );
}

export default ChannelNav;
