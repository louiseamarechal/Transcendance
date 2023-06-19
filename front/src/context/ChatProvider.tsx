import { PropsWithChildren, createContext, useState } from 'react';

export const ChatContext = createContext({
  showCreateChannel: false,
  setShowCreateChannel: (_: boolean) => {},
  showChannel: NaN,
  setShowChannel: (_: number) => {},
});

type Props = PropsWithChildren<{}>;

export const ChatProvider = ({ children }: Props) => {
  const [showChannel, setShowChannel] = useState<number>(NaN);
  const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{
        showChannel,
        setShowChannel,
        showCreateChannel,
        setShowCreateChannel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};