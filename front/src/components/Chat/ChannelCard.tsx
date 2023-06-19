import '../../style/components/chat/channel-card.css';

function ChannelCard(
  id: Number,
  name: string,
  avatar: string,
  showChannel: Number,
  setShowChannel: (c: Number) => any,
) {
  return (
    <div
      className={'channel-card ' + (showChannel === id) ? 'selected' : ''}
      id={id.toString()}
      onClick={setShowChannel(id)}
    >
      <img src={avatar} className="channel-avatar" alt="avatar" />
      <div className="channel-name">
        <p>{name}</p>
      </div>
    </div>
  );
}

export default ChannelCard;
