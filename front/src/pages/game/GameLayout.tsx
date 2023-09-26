import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.ts';
import { gameSocket } from '../../api/socket.ts';
// import { useUser } from '../../hooks/useUser.ts';

export default function GameLayout() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Connect to gameSocket');

    gameSocket.auth = {
      token: auth.access_token,
      // data: { id: myId, name: myName },
    };
    gameSocket.connect();

    return () => {
      console.log('Disconnect from gameSocket');
      gameSocket.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    function onServerGameNavigate(value: { to: string }) {
      console.log(`Server asked client to navigate to ${value.to}`);
      navigate(value.to);
    }

    // gameSocket.on('server.game.navigateGame', onServerGameNavigateGame);
    gameSocket.on('server.game.navigate', onServerGameNavigate);

    return () => {
      // gameSocket.off('server.game.navigateGame', onServerGameNavigateGame);
      gameSocket.off('server.game.navigate', onServerGameNavigate);
    };
  }, []);

  return <Outlet />;
}
