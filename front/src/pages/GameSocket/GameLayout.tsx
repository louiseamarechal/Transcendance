import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuth from '../../hooks/useAuth.ts';

export default function GameLayout() {
  const { auth } = useAuth();

  useEffect(() => {
    console.log('Connect to websocket');
    const socket = io('http://localhost:3000/game', {
      auth: { token: auth.access_token },
    });

    return () => {
      console.log('Disconnect from websocket');
      socket.disconnect();
    };
  }, [auth]);

  return <Outlet />;
}
