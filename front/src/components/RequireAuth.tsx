import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import useNavbar from '../hooks/useNavbar';
import { Socket, io } from 'socket.io-client';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const { navbarState } = useNavbar();
  const AppURL = 'http://localhost:3000';
  const [notifSocket, setNotifSocket] = useState<Socket>();
  
  // function receiveNotif() {
  //   console.log('someone is reaching out !');
  // }
  
  useEffect(() => {
    const newSocket = io(AppURL, { auth: { token: auth.access_token } });
    setNotifSocket(newSocket);
    return () => {
      newSocket.disconnect();
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
