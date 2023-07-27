import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import useNavbar from '../hooks/useNavbar';
import { notifSocket } from '../api/socket';
// import { Socket, io } from 'socket.io-client';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const { navbarState } = useNavbar();
  
  useEffect(() => {
    notifSocket.auth = {
      token: auth.access_token,
    }

    notifSocket.connect()
    return () => {
      notifSocket.disconnect();
    };
  }, [auth]);

  return auth.access_token ? ( // is the user logged in ?
    <>
      <NavBar />
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
