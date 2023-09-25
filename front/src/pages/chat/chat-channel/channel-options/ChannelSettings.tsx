import { useState } from 'react';
import { useUser } from '../../../../hooks/useUser';
import { createPortal } from 'react-dom';
import useChannel from '../../../../hooks/useChannel';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import CancelPrompt from '../../../../components/CancelPrompt';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useChannelList from '../../../../hooks/useChannelList';
import { ChannelShort } from '../../../../types/Channel.type';

export default function ChannelSettings() {
  const axiosPrivate = useAxiosPrivate();
  const channelState = useChannel();
  const navigate = useNavigate();
  const channelListState = useChannelList();
  const { myId } = useUser();
  const [nameEdit, setNameEdit] = useState<string>('');
  const [avatarEdit, setAvatarEdit] = useState<string>('');
  const [passwordEdit, setPasswordEdit] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const isDM: boolean = searchParams.get('isDM') === 'true';
  const isOwner: boolean = channelState.self.ownerId === myId;

  async function changeChannelName() {
    if (!nameEdit || nameEdit === '') {
      alert('Cannot have empty name for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channelState.self.id}`, {
          name: nameEdit,
        })
        .then((res) => {
          channelState.reset({ ...channelState.self, name: res.data.name });
          channelListState.reset(
            channelListState.self.map((ch: ChannelShort) => {
              if (ch.id === channelState.self.id) {
                return { ...ch, name: res.data.name };
              } else {
                return ch;
              }
            }),
          );
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
          channelListState.reset(
            channelListState.self.map((ch: ChannelShort) => {
              if (ch.id === channelState.self.id) {
                return { ...ch, avatar: res.data.avatar };
              } else {
                return ch;
              }
            }),
          );
        });
    }
  }

  async function changeChannelPassword() {
    if (!passwordEdit || passwordEdit === '') {
      alert('Cannot have empty password for channel.');
    } else {
      await axiosPrivate
        .patch(`channel/${channelState.self.id}`, {
          password: passwordEdit,
        })
        .catch((e) => {
          console.error(e);
        });
      setPasswordEdit('');
    }
  }

  async function deleteChannel() {
    setShowModal(false);
    await axiosPrivate
      .delete(`channel/${channelState.self.id}`)
      .then((_) => {
        console.log(`channel ${channelState.self.id} deleted`);
        channelListState.reset(
          channelListState.self.filter((ch) => ch.id !== channelState.self.id),
        );
        navigate('/chat');
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async function leaveChannel() {
    console.log(`Member ${myId} left channel ${channelState.self.name}`);
    setShowModal(false);
    await axiosPrivate
      .delete(`channel/member/${channelState.self.id}/${myId}`)
      .then(() => {
        channelListState.reset(
          channelListState.self.filter((ch) => ch.id !== channelState.self.id),
        );
        navigate('/chat');
      })
      .catch((e) => console.error(e));
  }

  if (isDM) {
    return <div />;
  } else if (
    !isOwner &&
    !channelState.self.admins.some(
      (admin: { userId: number }) => admin.userId === myId,
    )
  ) {
    return (
      <>
        <div>
          <p>Contact channel owner or admin for admin rights.</p>
          <button
            className="small-button leave-channel-button"
            onClick={() => setShowModal(true)}
          >
            Leave channel
          </button>
        </div>
        {showModal &&
          createPortal(
            <CancelPrompt
              message={'leave channel?'}
              onContinue={leaveChannel}
              onCancel={() => setShowModal(false)}
            />,
            document.body,
          )}
      </>
    );
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
          {channelState.self.visibility === 'PROTECTED' ? (
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
          {isOwner ? ( // Case for admin only
            <button
              className="small-button"
              id="delete-channel-button"
              onClick={() => setShowModal(true)}
            >
              Delete channel
            </button>
          ) : (
            <button
              className="small-button leave-channel-button"
              onClick={() => setShowModal(true)}
            >
              Leave channel
            </button>
          )}
        </div>
        {showModal &&
          createPortal(
            <CancelPrompt
              message={isOwner ? 'delete channel?' : 'Leave channel?'}
              onContinue={isOwner ? deleteChannel : leaveChannel}
              onCancel={() => setShowModal(false)}
            />,
            document.body,
          )}
      </>
    );
  }
}
