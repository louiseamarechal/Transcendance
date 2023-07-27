import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Channel } from '../../../../types/Channel.type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import '../../../../style/components/chat/chat-container/chat-messaging/chat-header.css';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const ChatHeader = ({
  channel,
  showOptions,
  setShowOptions,
}: {
  channel: Channel;
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [channelName, setChannelName] = useState<string>(channel.name);
  const [channelAvatar, setChannelAvatar] = useState<string>(channel.avatar);

  useEffect(() => {
    if (channelName === '' && channelAvatar === '') {
      axiosPrivate.get('channel/correspondent/' + channel.id).then((res) => {
        setChannelName(res.data.name);
        setChannelAvatar(res.data.avatar);
      });
    }
  });

  return (
    <div className="chat-header">
      <img className="avatar-sm" src={channelAvatar} />
      <p>{channelName}</p>
      <div
        className="options-menu"
        onClick={() => {
          console.log('menu ' + showOptions);
          setShowOptions(!showOptions);
        }}
      >
        <FontAwesomeIcon
          className="fa-lg"
          icon={faEllipsisVertical}
          style={{ color: 'var(--black)' }}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
