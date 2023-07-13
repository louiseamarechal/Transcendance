import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.ts';
import { socket } from '../../api/socket.ts';
// import { useUser } from '../../hooks/useUser.ts';

function GameLayout() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  // const { myId, myName } = useUser();

  useEffect(() => {
    console.log('Connect to websocket');

    socket.auth = {
      token: auth.access_token,
      // data: { id: myId, name: myName },
    };
    socket.connect();

    return () => {
      console.log('Disconnect from websocket');
      socket.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    // function onServerGameNavigateGame(value: { id: number }) {
    //   console.log(value);
    //   navigate(`/gamesocket/${value.id}`);
    // }

    function onServerGameNavigate(value: {to: string}) {
      console.log(`Server asked client to navigate to ${value.to}`)
      navigate(value.to)
    }

    // socket.on('server.game.navigateGame', onServerGameNavigateGame);
    socket.on('server.game.navigate', onServerGameNavigate);

    return () => {
      // socket.off('server.game.navigateGame', onServerGameNavigateGame);
      socket.off('server.game.navigate', onServerGameNavigate);
    };
  }, []);

  return <Outlet />;
}

export default GameLayout;
