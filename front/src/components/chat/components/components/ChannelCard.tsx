import { useEffect, useState } from 'react';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Avatar from '../../../Avatar';
import { ChannelShort } from '../../../../types/Channel.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../../../hooks/useUser';
import { useNavigate, useParams } from 'react-router-dom';

function ChannelCard({ channel }: { channel: ChannelShort }) {
  const { myId } = useUser();
  const axiosPrivate = useAxiosPrivate();
  const [channelName, setChannelName] = useState<string>(channel.name);
  const [channelAvatar, setChannelAvatar] = useState<string>(channel.avatar);
  const navigate = useNavigate();
  const routeParams = useParams();
  const channelId: number | undefined = Number(routeParams?.channelId);

  useEffect(() => {
    if (channel.name === '' && channel.avatar === '') {
      axiosPrivate.get('channel/correspondent/' + channel.id).then((res) => {
        setChannelName(res.data.name);
        setChannelAvatar(res.data.avatar);
      });
    }
  });

  return (
    <div className="channel-div">
      <div
        className={
          'channel-card ' +
          (channelId && channelId === channel.id ? 'selected' : '')
        }
        onClick={() => navigate(`${channel.id}`)}
      >
        <Avatar file={channelAvatar} small={true}/>
        <div>
          <p className='pl-[5%]'>{channelName}</p>
        </div>
        <div>
          {channel.visibility === 'PROTECTED' &&
          !channel.members.some(
            (m: { userId: number }) => m.userId === myId,
          ) ? (
            <FontAwesomeIcon
              className="fa-sm"
              icon={faKey}
              style={{ color: 'var(--black)' }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChannelCard;
