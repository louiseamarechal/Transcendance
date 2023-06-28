import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import { notifSocket } from '../api/socket';
import NavBar from './NavBar';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

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
      <NavBar notifSocket={notifSocket}/>
      <Outlet /> // it is a placeholder that enables RequireAuth component to
      render its child Routes (see the app for all routes)
    </>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  ); // else replace its current location with the Login page
};

export default RequireAuth;
