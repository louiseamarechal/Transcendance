import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { axiosPrivate } from '../../../../../../../api/axios';
import { User } from '../../../../../../../types/User.type';
import { Channel } from '../../../../../../../types/Channel.type';
import { useUser } from '../../../../../../../hooks/useUser';
import useChannel from '../../../../../../../hooks/useChannel';

function MuteButton({ user }: { user: User }) {
  const channelState = useChannel();
  const { myId } = useUser();
  const [muted, setMuted] = useState<boolean>(false);
  useEffect(() => {
    axiosPrivate
      .get(`channel/muted/${channelState.self.id}/${user.id}`)
      .then((res) => {
        if (res.data !== '') {
          setMuted(true);
        }
      });
  });

  async function mute() {
    await axiosPrivate
      .post(`channel/muted/${channelState.self.id}`, { mutedId: user.id })
      .then(() => {
        setMuted(true);
        const updatedMuted: {
          mutedUserId: number;
          mutedByUserId: number;
        }[] = [
          ...channelState.self.muted,
          { mutedUserId: user.id, mutedByUserId: myId },
        ];
        const updatedChannel: Channel = {
          ...channelState.self,
          muted: updatedMuted,
        };
        channelState.reset(updatedChannel);
      })
      .catch((e) => {
        if (e.response.status !== 409) {
          throw e;
        }
      });
  }

  async function unmute() {
    await axiosPrivate
      .delete(`channel/muted/${channelState.self.id}/${user.id}`)
      .then(() => {
        setMuted(false);
        const updatedMuted: {
          mutedUserId: number;
          mutedByUserId: number;
        }[] = channelState.self.muted.filter((muted) => {
          return muted.mutedByUserId !== myId && muted.mutedUserId !== user.id;
        });
        const updatedChannel: Channel = {
          ...channelState.self,
          muted: updatedMuted,
        };
        channelState.reset(updatedChannel);
      })
      .catch((e) => {
        if (e.response.status !== 409) {
          throw e;
        }
      });
  }
  if (muted) {
    return (
      <div className="option-button" onClick={() => unmute()}>
        <FontAwesomeIcon icon={faVolumeXmark} style={{ color: 'grey' }} />
      </div>
    );
  } else {
    return (
      <div className="option-button" onClick={() => mute()}>
        <FontAwesomeIcon icon={faVolumeHigh} style={{ color: 'grey' }} />
      </div>
    );
  }
}

export default MuteButton;
