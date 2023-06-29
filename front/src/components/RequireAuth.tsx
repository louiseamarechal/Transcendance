import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import { notifSocket } from '../api/socket';
import NavBar from './NavBar';
import useNavbar from '../hooks/useNavbar';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const { navbarState } = useNavbar();

  function receiveNotif() {
    console.log('someone is reaching out !');
  }

  useEffect(() => {
    if (auth.access_token) {
      notifSocket.connect();
      if (notifSocket.connected) {
        console.log('Socket connected !');
      } else {
        console.log('pas reussi');
      }

      notifSocket.on('notif', receiveNotif);
    }

    return () => {
      notifSocket.disconnect();
    };
  }, []);

  return auth.access_token ? ( // is the user logged in ?
    <>
      <NavBar notifSocket={notifSocket} />
      <div
        className={
          'h-screen overflow-auto main-content ' +
          (navbarState ? 'opened-nav-margin' : 'w-full')
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
