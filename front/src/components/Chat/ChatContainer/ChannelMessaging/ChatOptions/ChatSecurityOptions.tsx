import { useUser } from '../../../../../hooks/useUser';
import { Channel } from '../../../../../types/Channel.type';
import '../../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import '../../../../../style/components/buttons.css';
import { Dispatch, SetStateAction, useState } from 'react';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import { createPortal } from 'react-dom';
import CancelPrompt from '../../../../CancelPrompt';

const ChatSecurityOptions = ({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: Dispatch<SetStateAction<Channel>>;
}) => {
  const { myId } = useUser();
  const [nameEdit, setNameEdit] = useState<string>('');
  const [avatarEdit, setAvatarEdit] = useState<string>('');
  const [passwordEdit, setPasswordEdit] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  async function changeChannelName() {
    if (!nameEdit || nameEdit === '') {
      alert('Cannot have empty name for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channel.id}`, {
          name: nameEdit,
        })
        .then((res) => {
          console.log('changing name.');
          setChannel({ ...channel, name: res.data.name });
        });
    }
  }

  async function changeChannelAvatar() {
    if (!avatarEdit || avatarEdit === '') {
      alert('Cannot have empty avatar for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channel.id}`, {
          avatar: avatarEdit,
        })
        .then((res) => {
          setChannel({ ...channel, avatar: res.data.avatar });
        });
    }
  }

  async function changeChannelPassword() {
    if (!passwordEdit || passwordEdit === '') {
      alert('Cannot have empty password for channel.');
    } else {
      await axiosPrivate.patch(`channel/${channel.id}`, {
        password: passwordEdit,
      });
    }
  }

  async function deleteChannel() {
    setShowModal(false);
    await axiosPrivate.delete(`channel/${channel.id}`).then((_) => {
      console.log(`channel ${channel.id} deleted`);
    });
  }

  if (
    channel.ownerId !== myId &&
    !channel.admins.some((admin: { userId: number }) => admin.userId === myId)
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
          {channel.visibility === 'PROTECTED' ? (
            <div className="change-option">
              <p>Change channel password: </p>
              <input
                type="text"
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
          {channel.ownerId === myId ? ( // Case for admin only
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
};

export default ChatSecurityOptions;
