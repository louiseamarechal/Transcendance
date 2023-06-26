// import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import '../style/components/navbar.css';
import useNavbar from '../hooks/useNavbar';
import { useUser } from '../hooks/useUser';

const NavBar = () => {
  const { navbarState, setNavbarState } = useNavbar();
  const location = useLocation();
  const { myAvatar } = useUser();

  const navElems = [
    {
      to: '/profil',
      content: <img className="avatar" alt="avatar" src={myAvatar} />,
    },
    { to: '/game', content: 'Game' },
    { to: '/gamesocket', content: 'GameSocket' },
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

  if (location.pathname === '/' || location.pathname === '/game/playgame') {
    return null;
  }

  if (!myAvatar) {
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
        <ul className="navbar-links">
          {navElems.map((elem) => {
            return (
              <Link to={elem.to} onClick={() => setNavbarState(false)}>
                {elem.content}
              </Link>
            );
          })}
        </ul>
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
