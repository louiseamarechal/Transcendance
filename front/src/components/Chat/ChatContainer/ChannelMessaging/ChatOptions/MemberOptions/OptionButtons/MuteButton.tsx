import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { axiosPrivate } from '../../../../../../../api/axios';
import { User } from '../../../../../../../types/User.type';
import { useEffect, useState } from 'react';
import useChannel from '../../../../../../../hooks/useChannel';

function MuteButton({ user }: { user: User }) {
  const channelState = useChannel();
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
