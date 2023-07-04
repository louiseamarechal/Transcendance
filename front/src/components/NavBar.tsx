// import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../hooks/useUser';
import useNavbar from '../hooks/useNavbar';
import { DisplayNotification } from './notif/Notification';
import { Socket } from 'socket.io-client';

import '../style/components/navbar.css';

type NavbarProps = {notifSocket: Socket | undefined}
// type NavbarProps = { game: number; chat: number; friends: number };
const NavBar = ({notifSocket}: NavbarProps) => {
// const NavBar = () => {
  const { navbarState, setNavbarState } = useNavbar();
  const location = useLocation();
  const { myAvatar } = useUser();

  const navElems = [
    {
      to: '/profil',
      content: <img className="avatar" alt="avatar" src={myAvatar} />,
    },
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
    { to: '/profil/6', content: 'Profil 6' },
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
          {navElems.map((elem, index) => {
            return (
              <div className="relative" key={index}>
                {typeof(elem.content) === 'string' ? (
                  <DisplayNotification element={elem.content} notifSocket={notifSocket} />
                ) : (
                  ''
                )}
                <Link to={elem.to} onClick={() => setNavbarState(false)}>
                  {elem.content}
                </Link>
              </div>
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
