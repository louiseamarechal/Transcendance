import { PropsWithChildren, createContext, useState } from 'react';

export const UserContext = createContext({
  myId: 0,
  setMyId: (_: number) => {},
  myName: '',
  setMyName: (_: string) => {},
  myLogin: '',
  setMyLogin: (_: string) => {},
  myAvatar: '',
  setMyAvatar: (_: string) => {},
  myLevel: 0,
  setMyLevel: (_: number) => {},
});

type Props = PropsWithChildren<{}>;

export const UserProvider = ({ children }: Props) => {
  const [myId, setMyId] = useState<number>(0);
  const [myName, setMyName] = useState<string>('');
  const [myAvatar, setMyAvatar] = useState<string>('');
  const [myLevel, setMyLevel] = useState<number>(0);
  const [myLogin, setMyLogin] = useState<string>('');

  return (
    <UserContext.Provider
      value={{
        myId,
        setMyId,
        myName,
        setMyName,
        myLogin,
        setMyLogin,
        myAvatar,
        setMyAvatar,
        myLevel,
        setMyLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
