import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/create-channel-form.css';
import '../../../style/components/buttons.css';
import { useChatContext } from '../../../hooks/useChatContext';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import FriendsList from './CreateChannelForm/FriendsList';
import FormHeader from './CreateChannelForm/FormHeader';
import { useUser } from '../../../hooks/useUser';
import { channelSocket } from '../../../api/socket';

const CreateChannelForm = () => {
  const [avatar, setAvatar] = useState<string>(
    'http://localhost:3000/public/default.jpg',
  );
  const axiosPrivate = useAxiosPrivate();
  const { myId } = useUser();
  const { channelList, setChannelList, setShowCreateChannel, setShowChannel } =
    useChatContext();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [channelName, setChannelName] = useState<string>();

  async function handleSubmit() {
    if (!channelName) {
      alert('Channel name must be filled.');
    } else if (selectedFriends.length < 2) {
      alert('Group channel should have at least 3 members.');
    } else {
      await axiosPrivate
        .post('channel', {
          name: channelName,
          avatar,
          members: [...selectedFriends, myId],
        })
        .then((res) => {
          setChannelList([...channelList, res.data]);
          // channelSocket.emit('create-channel-room', res.data.id);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setShowCreateChannel(false);
            setShowChannel(err.response.data.channelId);
          }
        });
    }
  }

  return (
    <div className="channel-form">
      <FormHeader
        avatar={avatar}
        setAvatar={setAvatar}
        setChannelName={setChannelName}
      />
      <FriendsList
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
      />
      <button className="small-button" onClick={() => handleSubmit()}>
        create channel
      </button>
    </div>
  );
};

export default CreateChannelForm;
