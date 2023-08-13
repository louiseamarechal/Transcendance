import { Channel } from '../../../../types/Channel.type';
import '../../../../style/components/chat/chat-container/chat-messaging/chat-options.css';
import { Dispatch, SetStateAction, useState } from 'react';
import MembersList from './ChatOptions/MembersList';
import ChatSecurityOptions from './ChatOptions/ChatSecurityOptions';

const ChatOptions = ({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: Dispatch<SetStateAction<Channel>>;
}) => {
  const [selected, setSelected] = useState<string>('members');

  console.log({ channel });
  return (
    <div className="options-window">
      <div className="options-header">
        <div
          className={'options-tab'}
          onClick={() => {
            console.log('clicked members');
            setSelected('members');
          }}
        >
          <p
            className={
              selected === 'members' ? 'text-black-500' : 'text-gray-500'
            }
          >
            Members
          </p>
        </div>
        <div
          className="options-tab"
          onClick={() => {
            console.log('clicked security');
            setSelected('security');
          }}
        >
          <p
            className={
              selected === 'security' ? 'text-black-500' : 'text-gray-500'
            }
          >
            Security
          </p>
        </div>
      </div>
      <div className="options-body">
        {selected === 'members' ? (
          <MembersList
            key={`chat-options-member-list`}
            channel={channel}
            setChannel={setChannel}
          />
        ) : (
          <ChatSecurityOptions channel={channel} />
        )}
      </div>
    </div>
  );
};

export default ChatOptions;
