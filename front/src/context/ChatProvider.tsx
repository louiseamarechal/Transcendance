import { PropsWithChildren, createContext, useState } from 'react';
import { Channel } from '../types/Channel.type';

export const ChatContext = createContext({
  showCreateChannel: false,
  setShowCreateChannel: (_: boolean) => {},
  showChannel: NaN,
  setShowChannel: (_: number) => {},
  channelList: new Array<Channel>(),
  setChannelList: (_: Channel[]) => {},
});

type Props = PropsWithChildren<{}>;

export const ChatProvider = ({ children }: Props) => {
  const [showChannel, setShowChannel] = useState<number>(NaN);
  const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<Channel[]>([]);

  return (
    <ChatContext.Provider
      value={{
        showChannel,
        setShowChannel,
        showCreateChannel,
        setShowCreateChannel,
        channelList,
        setChannelList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
