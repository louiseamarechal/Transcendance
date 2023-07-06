import { useEffect } from 'react';
import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

function ChannelCard(id: number, name: string, avatar: string) {
  const { showChannel, setShowChannel } = useChatContext();
	const axiosPrivate = useAxiosPrivate();
  let [channelName, channelAvatar] = [name, avatar];

  useEffect(() => {
    axiosPrivate.get('channel/correspondent/' + id).then((res) => {
      channelName = res.data.name;
      channelAvatar = res.data.avatar;
    });
  }, []);

  return (
    <li
      className={'channel-card ' + (showChannel === id) ? 'selected' : ''}
      key={id.toString()}
      onClick={() => setShowChannel(id)}
    >
      <img
        src={avatar === '' ? avatar : channelAvatar}
        className="channel-avatar"
        alt="avatar"
      />
      <div className="channel-name">
        <p>{name === '' ? name : channelName}</p>
      </div>
    </li>
  );
}

export default ChannelCard;
