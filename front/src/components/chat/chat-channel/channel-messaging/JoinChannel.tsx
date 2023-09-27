import { useState } from 'react';
import { useUser } from '../../../../hooks/useUser';
import { Channel, ChannelShort } from '../../../../types/Channel.type';
import { PublicUser } from '../../../../../../shared/common/types/user.type';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useChannelList from '../../../../hooks/useChannelList';
import useChannel from '../../../../hooks/useChannel';

export default function JoinChannel() {
  const axiosPrivate = useAxiosPrivate();
  const channelState = useChannel();
  const { myId } = useUser();
  const channelListState = useChannelList();
  const [password, setPassword] = useState<string>('');

  function joinChannel() {
    if (!password && channelState.self.visibility === 'PROTECTED') {
      alert('Cannot join protected channel without password.');
    } else {
      axiosPrivate
        .patch(`channel/join/${channelState.self.id}`, {
          password:
            channelState.self.visibility === 'PROTECTED' ? password : null,
        })
        .then((res) => {
          const newMembers: { user: PublicUser }[] = [
            ...channelState.self.members,
            { user: res.data },
          ];
          const updatedChannel: Channel = {
            ...channelState.self,
            members: newMembers,
          };
          channelListState.reset(
            channelListState.self.map((ch: ChannelShort) => {
              if (ch.id === channelState.self.id) {
                return { ...ch, members: [...ch.members, { userId: myId }] };
              } else {
                return ch;
              }
            }),
          );
          channelState.reset(updatedChannel);
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

  if (channelState.self.members.some((m) => m.user.id === myId)) {
    return null;
  } else if (channelState.self.visibility === 'PUBLIC') {
    return (
      <div className="small-button">
        <button onClick={joinChannel}>Join</button>
      </div>
    );
  } else {
    return (
      <div className="div-protected">
        <input
          className="password-input"
          type="password"
          placeholder="channel password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={joinChannel}>Join</button>
      </div>
    );
  }
}
