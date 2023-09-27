import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import NavBar from './navbar/NavBar';
import useNavbar from '../hooks/useNavbar';
import { notifSocket } from '../api/socket';
import useRefreshToken from '../hooks/useRefreshToken';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const navbar = useNavbar();
  const refresh = useRefreshToken();

  function onConnectError(error: Error) {
    console.log({ reconnectError: error.message });
    refresh();
  }

  useEffect(() => {
    notifSocket.auth = { token: auth.access_token };
    console.log('Connect notifSocket');

    notifSocket.connect();
    notifSocket.on('connect_error', onConnectError);

    return () => {
      console.log('Disconnect notifSocket');
      notifSocket.off('connect_error', onConnectError);
      notifSocket.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      notifSocket.emit('client.notif.ping', location.pathname);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [location]);

  return auth.access_token ? ( // is the user logged in ?
    <>
      <NavBar />
      <div
        className={
          'h-screen overflow-auto main-content ' +
          (navbar.navbarState ? 'opened-nav-margin' : 'w-full')
        }
      >
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  ); // else replace its current location with the Login page
};

export default RequireAuth;
