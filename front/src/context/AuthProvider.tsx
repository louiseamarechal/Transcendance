import { createContext, useState } from 'react';
import { AuthContent } from '../types/AuthContent.dto';
import { Tokens } from '../types/Tokens.dto';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AuthContext = createContext<AuthContent>({
  auth: { access_token: '', refresh_token: '' },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Tokens>({
    access_token: '',
    refresh_token: '',
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
