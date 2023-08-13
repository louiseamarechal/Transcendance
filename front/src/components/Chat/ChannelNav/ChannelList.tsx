import { useEffect, useState } from 'react';
import '../../../style/components/chat/channel-nav/channel-list.css';
import '../../../style/components/buttons.css';
import { Link } from 'react-router-dom';
import ChannelCard from './ChannelList/ChannelCard';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { ChannelShort } from '../../../types/Channel.type';
import { useChatContext } from '../../../hooks/useChatContext';
import { useUser } from '../../../hooks/useUser';

const ChannelList = () => {
  const axiosPrivate = useAxiosPrivate();
  const { myId } = useUser();
  const { channelList, setChannelList } = useChatContext();
  const [isClicked, setIsClicked] = useState<number>(NaN);

  useEffect(() => {
    axiosPrivate
      .get('channel/my-channels')
      .then((res) => {
        setChannelList(res.data);
      })
      .catch((err) => {
        console.log(err.response.status + ' -> ' + err.response.statusText);
      });
  }, []);

  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          <li id="add-friend">
            <Link to={'/FindFriends'}>
              <p>Add friend</p>
            </Link>
          </li>
          <li>
            <p className="channel-group">Your channels</p>
          </li>
          {channelList
            .filter((elem: ChannelShort) => {
              console.log(
                `channel ${elem.id}: ${elem.members.map((e) => e.userId)}`,
              );
              return elem.members.some((e) => e.userId === myId);
            })
            .map((elem: ChannelShort) => {
              return (
                <li key={`channel-${elem.id}`}>
                  <ChannelCard
                    channel={elem}
                    isMember={true}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                  />
                </li>
              );
            })}
          <li>
            <p className="channel-group">Channels you can join</p>
          </li>
          {channelList
            .filter((elem: ChannelShort) => {
              console.log(
                `channelShoChannel ${elem.id}: ${elem.members.map(
                  (e) => e.userId,
                )}`,
              );
              return !elem.members.some((e) => e.userId === myId);
            })
            .map((elem: ChannelShort) => {
              return (
                <li key={elem.id}>
                  <ChannelCard
                    channel={elem}
                    isMember={false}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default ChannelList;
