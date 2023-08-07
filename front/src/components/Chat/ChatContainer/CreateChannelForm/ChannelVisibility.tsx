import { Dispatch, SetStateAction } from 'react';
import ChannelList from '../../ChannelNav/ChannelList';

function ChannelVisibility({
  channelVis,
  setChannelVis,
  channelPassword,
  setChannelPassword,
}: {
  channelVis: string;
  setChannelVis: Dispatch<SetStateAction<string>>;
  channelPassword: string;
  setChannelPassword: Dispatch<SetStateAction<string>>;
}) {
  function handleOnChangePublic() {
    if (channelVis === 'PUBLIC') {
      setChannelVis('');
    } else {
      setChannelVis('PUBLIC');
    }
  }

  function handleOnChangeProtected() {
    if (channelVis === 'PROTECTED') {
      setChannelVis('');
    } else {
      setChannelVis('PROTECTED');
    }
  }

  function handleOnChangePrivate() {
    if (channelVis === 'PRIVATE') {
      setChannelVis('');
    } else {
      setChannelVis('PRIVATE');
    }
  }

  return (
    <div className="friends-list">
      <p>Choose channel visibility</p>
      <div className="box-check-vis">
        <div className="vis-option">
          <p>PUBLIC</p>
          <input
            type="checkbox"
            id="PUBLIC"
            value="PUBLIC"
            checked={channelVis === 'PUBLIC'}
            onChange={handleOnChangePublic}
          />
        </div>
        <div className="vis-option">
          <p>PROTECTED</p>
          <input
            type="checkbox"
            id="PROTECTED"
            value="PROTECTED"
            checked={channelVis === 'PROTECTED'}
            onChange={handleOnChangeProtected}
          />
        </div>
        <div className="vis-option">
          <p>PRIVATE</p>
          <input
            type="checkbox"
            id="PRIVATE"
            value="PRIVATE"
            checked={channelVis === 'PRIVATE'}
            onChange={handleOnChangePrivate}
          />
        </div>
      </div>
    </div>
  );
}

export default ChannelVisibility;
