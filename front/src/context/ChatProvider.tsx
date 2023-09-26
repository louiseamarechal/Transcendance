import { PropsWithChildren, createContext, useState } from 'react';
import { ChannelShort } from '../types/Channel.type';

export const ChatContext = createContext({
  showCreateChannel: false,
  setShowCreateChannel: (_: boolean) => {},
  showChannel: NaN,
  setShowChannel: (_: number) => {},
  channelList: new Array<ChannelShort>(),
  setChannelList: (_: ChannelShort[]) => {},
});

type Props = PropsWithChildren<{}>;

export const ChatProvider = ({ children }: Props) => {
  const [showChannel, setShowChannel] = useState<number>(NaN);
  const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<ChannelShort[]>([]);

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
