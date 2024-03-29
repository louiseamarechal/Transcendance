import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useChannel from '../../../hooks/useChannel';
import Avatar from '../../ui/Avatar';
import '../../../style/components/chat/chat-container/chat-messaging/chat-header.css';

export default function ChatHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const channelState = useChannel();
  const [channelName, setChannelName] = useState<string>();
  const [channelAvatar, setChannelAvatar] = useState<string>();
  const isDM: boolean =
    channelState.self.name === '' && channelState.self.avatar === '';

  useEffect(() => {
    if (isDM) {
      axiosPrivate
        .get('channel/correspondent/' + channelState.self.id)
        .then((res) => {
          setChannelName(res.data.name);
          setChannelAvatar(res.data.avatar);
        });
    } else {
      setChannelName(channelState.self.name);
      setChannelAvatar(channelState.self.avatar);
    }
  }, [channelState]);

  return (
    <div className="chat-header">
      <Avatar file={channelAvatar} small={true} />
      <p>{channelName}</p>
      <div
        className="options-menu"
        onClick={() => {
          if (pathname.includes('options')) {
            navigate(`/chat/${channelState.self.id}`);
          } else {
            navigate(`options/members?isDM=${isDM}`);
          }
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
}
