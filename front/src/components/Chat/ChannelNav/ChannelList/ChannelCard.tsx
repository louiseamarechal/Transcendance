import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useChatContext } from '../../../../hooks/useChatContext';
import '../../../../style/components/chat/channel-nav/channel-list/channel-card.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Avatar from '../../../Avatar';
import { ChannelShort } from '../../../../types/Channel.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../../../hooks/useUser';

function ChannelCard({
  channel,
  isMember,
  isClicked,
  setIsClicked,
}: {
  channel: ChannelShort;
  isMember: boolean;
  isClicked: number;
  setIsClicked: Dispatch<SetStateAction<number>>;
}) {
  const {
    showChannel,
    setShowChannel,
    setShowCreateChannel,
    channelList,
    setChannelList,
  } = useChatContext();
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
      setIsClicked(channel.id);
    } else {
      setShowChannel(NaN);
      setIsClicked(channel.id);
    }
    console.log(`Now showing channel ${channel.id}`);
  }

  function joinChannel() {
    if (!password && channel.visibility === 'PROTECTED') {
      alert('Cannot join protected channel without password.');
    } else {
      axiosPrivate
        .patch(`channel/join/${channel.id}`, {
          password: channel.visibility === 'PROTECTED' ? password : null,
        })
        .then((_) => {
          setShowChannel(channel.id);
          setIsClicked(NaN);
          setChannelList(
            channelList.map((c: ChannelShort) => {
              if (c.id === channel.id) {
                c.members = [...c.members, { userId: myId }];
              }
              return c;
            }),
          );
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
    <div className="channel-div">
      <div
        className={
          'channel-card ' + (showChannel === channel.id ? 'selected' : '')
        }
        onClick={openChannel}
      >
        <Avatar file={channelAvatar} />
        <div>
          <p>{channelName}</p>
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
      {isClicked === channel.id && !isMember ? (
        <div className="join-channel">
          {channel.visibility === 'PUBLIC' ? (
            <button id="join-public" onClick={joinChannel}>
              Join
            </button>
          ) : (
            <div className="div-protected">
              <input
                id="password-input"
                type="password"
                placeholder="channel password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button id="join-private" onClick={joinChannel}>
                Join
              </button>
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
