import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import useAuth from '../../hooks/useAuth.ts';

function GameLayout() {
  const { auth } = useAuth();

  useEffect(() => {
    console.log('Connect to websocket');
    const socket: Socket = io('http://localhost:3000/game', {
      auth: { token: auth.access_token },
    });

    return () => {
      console.log('Disconnect from websocket');
      socket.disconnect();
    };
  }, [auth]);

  return <Outlet />;
}

export default GameLayout;
