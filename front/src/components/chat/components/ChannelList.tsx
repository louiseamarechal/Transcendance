import '../../../style/components/chat/channel-nav/channel-list.css';
import '../../../style/components/buttons.css';
import { useNavigate } from 'react-router-dom';
import { ChannelShort } from '../../../types/Channel.type';
import { useUser } from '../../../hooks/useUser';
import useChannelList from '../../../hooks/useChannelList';
import ChannelCard from './components/ChannelCard';

function ChannelList() {
  const { myId } = useUser();
  const navigate = useNavigate();
  const channelListState = useChannelList();

  return (
    <div className="channel-list">
      <div className="scrollable-list">
        <ul>
          <li id="add-friend">
            <button onClick={() => navigate('/FindFriends')}>Add friend</button>
          </li>
          <li>
            <p className="channel-group">Your channels</p>
          </li>
          {channelListState.self
            .filter((elem: ChannelShort) => {
              return elem.members.some((e) => e.userId === myId);
            })
            .map((elem: ChannelShort) => {
              return (
                <li key={`channel-${elem.id}`}>
                  <ChannelCard channel={elem} />
                </li>
              );
            })}
          <li>
            <p className="channel-group">Channels you can join</p>
          </li>
          {channelListState.self
            .filter((elem: ChannelShort) => {
              return !elem.members.some((e) => e.userId === myId);
            })
            .map((elem: ChannelShort) => {
              return (
                <li key={elem.id}>
                  <ChannelCard channel={elem} />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ChannelList;
