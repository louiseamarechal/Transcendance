import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';

function ChannelCard(
  id: number,
  name: string,
  // avatar: string,
) {
  const { showChannel, setShowChannel } = useChatContext();
  return (
    <li
      className={'channel-card ' + (showChannel === id) ? 'selected' : ''}
      key={id.toString()}
      onClick={() => {setShowChannel(id)}}
    >
      <img
        src={'http://localhost:3000/public/default.jpg'}
        className="channel-avatar"
        alt="avatar"
      />
      <div className="channel-name">
        <p>{name}</p>
      </div>
    </li>
  );
}

export default ChannelCard;
