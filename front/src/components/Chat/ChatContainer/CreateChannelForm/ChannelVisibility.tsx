import { Dispatch, SetStateAction } from 'react';

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
    if (channelVis !== 'PUBLIC') {
      setChannelVis('PUBLIC');
    }
  }

  function handleOnChangeProtected() {
    if (channelVis !== 'PROTECTED') {
      setChannelVis('PROTECTED');
    }
  }

  function handleOnChangePrivate() {
    if (channelVis !== 'PRIVATE') {
      setChannelVis('PRIVATE');
    }
  }

  return (
    <div className="visibility-list">
      <p>Choose channel visibility</p>
      <div className="vis-choice">
        <div className="vis-option">
          <button
            className={`small-button ${
              channelVis === 'PUBLIC' ? 'vis-selected' : 'vis-unselected'
            }`}
            onClick={handleOnChangePublic}
          >
            PUBLIC
          </button>
        </div>
        <div className="vis-option">
          <button
            className={`small-button ${
              channelVis === 'PROTECTED' ? 'vis-selected' : 'vis-unselected'
            }`}
            onClick={handleOnChangeProtected}
          >
            PROTECTED
          </button>
        </div>
        <div className="vis-option">
          <button
            className={`small-button ${
              channelVis === 'PRIVATE' ? 'vis-selected' : 'vis-unselected'
            }`}
            onClick={handleOnChangePrivate}
          >
            PRIVATE
          </button>
        </div>
      </div>
      {channelVis === 'PROTECTED' ? (
        <div className="password">
          <p>password: </p>
          <div />
          <input
            value={channelPassword}
            placeholder="password"
            onChange={(event) => setChannelPassword(event.target.value)}
          ></input>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default ChannelVisibility;
