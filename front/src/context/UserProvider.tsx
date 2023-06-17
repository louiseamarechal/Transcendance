import { PropsWithChildren, createContext, useContext, useState } from "react";

const UserContext = createContext({
  name: "",
  setName: (_: string) => {},
  avatar: "",
  setAvatar: (_: string) => {},
  level: 0,
  setLevel: (_: number) => {},
});

type Props = PropsWithChildren<{}>;

export const UserProvider = ({ children }: Props) => {
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [level, setLevel] = useState<number>(0);

  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        avatar,
        setAvatar,
        level,
        setLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
