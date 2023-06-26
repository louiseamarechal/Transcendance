import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { gameSocket } from '../../api/socket.ts';

export default function GameLayout() {
  useEffect(() => {
    console.log('Connect to websocket');
    gameSocket.connect();

    return () => {
      console.log('Disconnect from websocket');
      gameSocket.disconnect();
    };
  }, []);

  return <Outlet />;
}
