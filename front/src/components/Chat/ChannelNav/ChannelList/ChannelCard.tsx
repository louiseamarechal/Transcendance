import { useEffect } from 'react';
import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

type ChannelCardProps = {
  id: number;
  name: string;
  avatar: string;
};

function ChannelCard({ id, name, avatar }: ChannelCardProps) {
  const { showChannel, setShowChannel } = useChatContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
		if (name === '' && avatar === '') {
			axiosPrivate.get('channel/correspondent/' + id).then((res) => {
				name = res.data.name;
				console.log(`set channelName = ${res.data.name}`)
				avatar = res.data.avatar;
				console.log(`set avatar = ${res.data.avatar}`)
			});
		}
  }, []);

	console.log(`Rendering channel with name: ${name} and avatar: ${avatar}`)

	return (
    <div
      className={'channel-card ' + (showChannel === id) ? 'selected' : ''}
      onClick={() => setShowChannel(id)}
    >
      <img
        src={avatar}
        className="channel-avatar"
        alt="avatar"
      />
      <div className="channel-name">
        <p>{name}</p>
      </div>
    </div>
  );
}

export default ChannelCard;
