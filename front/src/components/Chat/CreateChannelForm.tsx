import { useEffect, useState } from 'react';
import { useChatContext } from '../../hooks/useChatContext';
import '../../style/components/chat/chat-container.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useUser } from '../../hooks/useUser';

const CreateChannelForm = () => {
  const axiosPrivate = useAxiosPrivate();
  // const { setShowCreateChannel, setShowChannel } = useChatContext();
  const [friends, setFriends] = useState<
    { id: number; name: string; level: number; avatar: string }[]
  >([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [channelName, setChannelName] = useState<string>();

  useEffect(() => {
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

  function createChannel() {
    if (!channelName) {
      alert('Channel name must be filled.');
    } else {
			useEffect(() => {
				axiosPrivate.post('channel', {
					name: channelName,
					avatar: 'plop',
					members: selectedFriends,
				})
			})
    }
  }

  return (
    <>
      <input
        className="channel-name"
        onChange={(event) => setChannelName(event.target.value)}
      ></input>
      <div className="friends-list"></div>
      <button className="small-button" onClick={createChannel}>
        create channel
      </button>
    </>
  );
};

export default CreateChannelForm;
