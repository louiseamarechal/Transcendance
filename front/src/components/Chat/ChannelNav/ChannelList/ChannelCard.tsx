import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Avatar from '../../../Avatar';
import { Channel } from '../../../../types/Channel.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../../../hooks/useUser';

function ChannelCard({
  channel,
  isMember,
  isClicked,
  setIsClicked,
}: {
  channel: Channel;
  isMember: boolean;
  isClicked: number;
  setIsClicked: Dispatch<SetStateAction<number>>;
}) {
  const { showChannel, setShowChannel, setShowCreateChannel } =
    useChatContext();
  const { myId } = useUser();
  const axiosPrivate = useAxiosPrivate();
  const [channelName, setChannelName] = useState<string>(channel.name);
  const [channelAvatar, setChannelAvatar] = useState<string>(channel.avatar);
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (channel.name === '' && channel.avatar === '') {
      axiosPrivate.get('channel/correspondent/' + channel.id).then((res) => {
        setChannelName(res.data.name);
        setChannelAvatar(res.data.avatar);
      });
    }
  });

  function openChannel() {
    if (isMember) {
      setShowCreateChannel(false);
      setShowChannel(channel.id);
    } else {
      setIsClicked(channel.id);
    }
    console.log(`Now showing channel ${channel.id}`);
  }

  function joinChannel() {
    if (!password && channel.visibility === 'PROTECTED') {
      alert('Cannot join protected channel without password.');
    } else {
      axiosPrivate
        .patch(`channel/${channel.id}`, {
          member: myId,
          password: channel.visibility === 'PROTECTED' ? password : undefined,
        })
        .then((_) => {
          setShowChannel(channel.id);
          setIsClicked(NaN);
        })
        .catch((err) => {
          console.log(err);
          if (err) {
            // if password is wrong, alert !
            alert('Wrong password.');
          }
        });
    }
  }

  return (
    <div>
      <div
        className={
          'channel-card ' + (showChannel === channel.id ? 'selected' : '')
        }
        onClick={() => openChannel}
      >
        <Avatar file={channelAvatar} />
        <div>
          <p>{channelName}</p>
        </div>
        <div>
          {channel.visibility === 'PROTECTED' &&
          !channel.members.some((m) => m.userId === myId) ? (
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
      {isClicked === channel.id && !isMember ? (
        <div className="join-channel">
          {channel.visibility === 'PUBLIC' ? (
            <div>
              <button onClick={joinChannel}>Join channel</button>
            </div>
          ) : (
            <div>
              <input
                placeholder="channel password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={joinChannel}>Join</button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ChannelCard;
