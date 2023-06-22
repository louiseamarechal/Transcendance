import { useEffect, useState } from 'react';
import '../../../style/components/chat/chat-container/create-channel-form.css';
import '../../../style/components/buttons.css';
import { useChatContext } from '../../../hooks/useChatContext';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import FriendsList from './CreateChannelForm/FriendsList';
import FormHeader from './CreateChannelForm/FormHeader';

const CreateChannelForm = () => {
  const [avatar, setAvatar] = useState<string>(
    'http://localhost:3000/public/default.jpg',
  );
  const axiosPrivate = useAxiosPrivate();
  const { setShowCreateChannel, setShowChannel } = useChatContext();
  const [friends, setFriends] = useState<
    { id: number; name: string; level: number; avatar: string }[]
  >([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [channelName, setChannelName] = useState<string>();

  useEffect(() => {
    FormHeader;
    axiosPrivate
      .get('friend-request/my-friends')
      .then((res) => {
        console.log(res);
        setFriends(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  async function handleSubmit() {
    if (!channelName) {
      alert('Channel name must be filled.');
    } else {
      await axiosPrivate
        .post('channel', {
          name: channelName,
          avatar,
          members: selectedFriends,
        })
        .catch((err) => {
          if (err.status === 409) {
            setShowCreateChannel(false);
            setShowChannel(err.statusText.channelId);
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
        friends={friends}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
      />
      <button type="submit" className="small-button" onSubmit={handleSubmit}>
        create channel
      </button>
    </div>
  );
};

export default CreateChannelForm;
