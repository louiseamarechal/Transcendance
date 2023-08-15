import { useState } from 'react';
import '../../../style/components/chat/chat-container/create-channel-form.css';
import '../../../style/components/buttons.css';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import FriendsList from './CreateChannelForm/FriendsList';
import FormHeader from './CreateChannelForm/FormHeader';
import { useUser } from '../../../hooks/useUser';
import { notifSocket } from '../../../api/socket';
import { User } from '../../../types/User.type';
import ChannelVisibility from './CreateChannelForm/ChannelVisibility';
import useChannelList from '../../../hooks/useChannelList';
import { useNavigate } from 'react-router-dom';

const CreateChannelForm = () => {
  const [avatar, setAvatar] = useState<string>('default.jpg');
  const axiosPrivate = useAxiosPrivate();
  const { myId, myLogin } = useUser();
  const channelListState = useChannelList();
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [channelName, setChannelName] = useState<string>();
  const [channelVis, setChannelVis] = useState<string>('PUBLIC');
  const [channelPassword, setChannelPassword] = useState<string>('');

  async function handleSubmit() {
    if (!channelName) {
      alert('Channel name must be filled.');
    } else if (selectedFriends.length < 2) {
      alert('Group channel should have at least 3 members.');
    } else if (channelVis === 'PROTECTED' && !channelPassword) {
      alert('Protected channel must have a password.');
    } else {
      await axiosPrivate
        .post('channel', {
          name: channelName,
          avatar,
          members: [...selectedFriends, myId],
          visibility: channelVis,
          password: channelVis === 'PROTECTED' ? channelPassword : undefined,
        })
        .then((res) => {
          channelListState.add(res.data);
          res.data.members.map((member: { user: User }) => {
            if (member.user.login !== myLogin)
              notifSocket.emit('client.notif.chatNotif', member.user.login);
          });
          navigate(`chat/${res.data.id}`);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            navigate(`chat/${err.response.data.channelId}`);
          }
        });
    }
  }

  return (
    <div className="channel-form">
      <FormHeader
        key={`channel-form-header`}
        avatar={avatar}
        setAvatar={setAvatar}
        setChannelName={setChannelName}
      />
      <FriendsList
        key={`channel-form-list`}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
      />
      <ChannelVisibility
        key={`channel-form-visibility`}
        channelVis={channelVis}
        setChannelVis={setChannelVis}
        channelPassword={channelPassword}
        setChannelPassword={setChannelPassword}
      />
      <button
        className="small-button"
        id="submit-button"
        onClick={() => handleSubmit()}
        // onKeyUp={(event) => {
        //   event.key === 'Enter' && handleSubmit();
        // }}
      >
        create channel
      </button>
    </div>
  );
};

export default CreateChannelForm;
