import { useState } from 'react';
import { useUser } from '../../../../hooks/useUser';
import { createPortal } from 'react-dom';
import useChannel from '../../../../hooks/useChannel';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import CancelPrompt from '../../../../components/ui/CancelPrompt';
import { useSearchParams } from 'react-router-dom';

export default function ChannelSettings() {
  const axiosPrivate = useAxiosPrivate();
  const channelState = useChannel();
  const { myId } = useUser();
  const [nameEdit, setNameEdit] = useState<string>('');
  const [avatarEdit, setAvatarEdit] = useState<string>('');
  const [passwordEdit, setPasswordEdit] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const isDM: boolean = searchParams.get('isDM') === 'true';

  async function changeChannelName() {
    if (!nameEdit || nameEdit === '') {
      alert('Cannot have empty name for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channelState.self.id}`, {
          name: nameEdit,
        })
        .then((res) => {
          console.log('changing name.');
          channelState.reset({ ...channelState.self, name: res.data.name });
        });
    }
  }

  async function changeChannelAvatar() {
    if (!avatarEdit || avatarEdit === '') {
      alert('Cannot have empty avatar for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channelState.self.id}`, {
          avatar: avatarEdit,
        })
        .then((res) => {
          channelState.reset({ ...channelState.self, avatar: res.data.avatar });
        });
    }
  }

  async function changeChannelPassword() {
    if (!passwordEdit || passwordEdit === '') {
      alert('Cannot have empty password for channel.');
    } else {
      await axiosPrivate.patch(`channel/${channelState.self.id}`, {
        password: passwordEdit,
      });
    }
  }

  async function deleteChannel() {
    setShowModal(false);
    await axiosPrivate.delete(`channel/${channelState.self.id}`).then((_) => {
      console.log(`channel ${channelState.self.id} deleted`);
    });
  }

  if (isDM) {
    return <div />;
  } else if (
    channelState.self.ownerId !== myId &&
    !channelState.self.admins.some(
      (admin: { userId: number }) => admin.userId === myId,
    )
  ) {
    return <p>Contact channel owner or admin for admin rights.</p>;
  } else {
    return (
      <>
        <div className="security-options">
          <div className="change-option">
            <p>Change channel name: </p>
            <input
              type="text"
              maxLength={15}
              placeholder="new channel name"
              onChange={(e) => setNameEdit(e.target.value)}
            />
            <button className="small-button" onClick={changeChannelName}>
              apply
            </button>
          </div>
          <div className="change-option">
            <p>Change channel avatar: </p>
            <input
              id="edit-avatar"
              type="file"
              onChange={(e) => setAvatarEdit(e.target.value)}
            />
            <button className="small-button" onClick={changeChannelAvatar}>
              apply
            </button>
          </div>
          {channelState.self.visibility === 'PROTECTED' ? (
            <div className="change-option">
              <p>Change channel password: </p>
              <input
                type="text"
                maxLength={15}
                placeholder="new channel password"
                onChange={(e) => setPasswordEdit(e.target.value)}
              />
              <button className="small-button" onClick={changeChannelPassword}>
                apply
              </button>
            </div>
          ) : (
            <></>
          )}
          {channelState.self.ownerId === myId ? ( // Case for admin only
            <button
              className="small-button"
              id="delete-channel-button"
              onClick={() => setShowModal(true)}
            >
              Delete channel
            </button>
          ) : (
            <></>
          )}
        </div>
        {showModal &&
          createPortal(
            <CancelPrompt
              message={'delete channel?'}
              onContinue={deleteChannel}
              onCancel={() => setShowModal(false)}
            />,
            document.body,
          )}
      </>
    );
  }
}
