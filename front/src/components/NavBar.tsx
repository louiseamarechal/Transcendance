// import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useNavbar from '../hooks/useNavbar';
import NavBarLinks from './NavBarLinks';

import '../style/components/navbar.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const NavBar = () => {
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

      axiosInstance
      .get('/notif/chat')
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
  
      const navElems = [
    {
      to: '/profil',
      content: <img className="avatar" alt="avatar" src={myAvatar} />,
    },
    { to: '/oldgame', content: 'OldGame' },
    { to: '/game', content: 'Game' },
    { to: '/chat', content: 'Chat' },
    { to: '/friends', content: 'Friends' },
    { to: '/test', content: 'Test' },
    { to: '/FindFriends', content: 'FindFriends' },
    { to: '/profil/1', content: 'Profil 1' },
    { to: '/profil/2', content: 'Profil 2' },
    { to: '/profil/3', content: 'Profil 3' },
    { to: '/profil/4', content: 'Profil 4' },
    { to: '/profil/5', content: 'Profil 5' },
  ];

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
