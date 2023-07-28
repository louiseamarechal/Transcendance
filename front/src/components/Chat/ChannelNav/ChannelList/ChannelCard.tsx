import { useEffect, useState } from 'react';
import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

type ChannelCardProps = {
  id: number;
  name: string;
  avatar: string;
};

function ChannelCard({ id, name, avatar }: ChannelCardProps) {
  const { showChannel, setShowChannel, setShowCreateChannel } = useChatContext();
  const axiosPrivate = useAxiosPrivate();
  const [channelName, setChannelName] = useState<string>(name);
  const [channelAvatar, setChannelAvatar] = useState<string>(avatar);

  useEffect(() => {
    if (name === '' && avatar === '') {
      axiosPrivate.get('channel/correspondent/' + id).then((res) => {
        setChannelName(res.data.name);
        setChannelAvatar(res.data.avatar);
      });
    }
  });

  return (
    <div
      className={'channel-card ' + (showChannel === id ? 'selected' : '')}
      onClick={() => {
				setShowCreateChannel(false);
        setShowChannel(id);
        console.log(`Now showing channel ${id}`);
      }}
    >
      <img src={channelAvatar} className="avatar-sm" alt="avatar" />
      <div>
        <p>{channelName}</p>
      </div>
      <div />
    </div>
  );
}

export default ChannelCard;
