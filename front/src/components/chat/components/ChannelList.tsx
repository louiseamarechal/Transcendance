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
      <p id="add-friend">
        Add friends{' '}
        <button onClick={() => navigate('/FindFriends')}>here</button>
      </p>
      <div className="scrollable-list">
        <div>
          <h3 className="channel-group">My channels</h3>
          <ul>
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
          </ul>
        </div>
        <div>
          {/* <h3 className="channel-group">Channels you can join</h3> */}
          <h3 className="channel-group">Public Channels</h3>
          <ul>
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
    </div>
  );
}

export default ChannelList;
