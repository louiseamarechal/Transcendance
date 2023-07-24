// import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useNavbar from '../hooks/useNavbar';
import { Socket } from 'socket.io-client';
import NavBarLinks from './NavBarLinks';

import '../style/components/navbar.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

type NavbarProps = { notifSocket: Socket | undefined };
const NavBar = ({ notifSocket }: NavbarProps) => {
  const { navbarState, setNavbarState } = useNavbar();
  const location = useLocation();
  const axiosInstance = useAxiosPrivate();
  const [receivedNotif, setReceivedNotif] = useState({
    friends: 0,
    game: 0,
    chat: 0,
  });

  useEffect(() => {
    axiosInstance
      .get('/notif/friend')
      .then((response) => {
        const data = response.data;
        setReceivedNotif((previous) => {
          return { ...previous, friends: data.length };
        });
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get('/notif/game')
      .then((response) => {
        const data = response.data;
        setReceivedNotif((previous) => {
          return { ...previous, game: data.length };
        });
      })
      .catch((error) => console.log(error));
  }, []);

  if (location.pathname === '/' || location.pathname === '/game/playgame') {
    return null;
  }

  if (navbarState === true)
    return (
      <div className="navbar-open">
        <FontAwesomeIcon
          icon={faXmark}
          className="opened-nav-button"
          style={{ color: 'var(--black)' }}
          onClick={() => {
            setNavbarState(false);
          }}
        />
        <NavBarLinks
          notifSocket={notifSocket}
          receivedNotif={receivedNotif}
          setReceivedNotif={setReceivedNotif}
        />
      </div>
    );
  else
    return (
      <FontAwesomeIcon
        icon={faBars}
        className="navbar-close"
        style={{ color: 'var(--black)' }}
        onClick={() => {
          setNavbarState(true);
        }}
      />
    );
};

export default NavBar;
