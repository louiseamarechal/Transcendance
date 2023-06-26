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

  if (location.pathname === '/' || location.pathname === '/game/playgame') {
    return null;
  }

  if (!myAvatar) {
    return <></>;
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
        {/* <button className={"opened-nav-button fa-solid fa-xmark"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(false)}}></button> */}
        <ul className="navbar-links">
          <Link
            to={'/profil'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            <img className="avatar" alt="avatar" src={myAvatar} />
          </Link>
          <Link
            to={'/game'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Game
          </Link>
          <Link
            to={'/chat'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Chat
          </Link>
          <Link
            to={'/friends'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Friends
          </Link>
          <Link
            to={'/settings'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Settings
          </Link>
          <Link
            to={'/test'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Test
          </Link>
          <Link
            to={'/FindFriends'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            FindFriends
          </Link>

          <Link
            to={'/profil/1'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Profile 1
          </Link>

          <Link
            to={'/profil/2'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Profile 2
          </Link>

          <Link
            to={'/profil/3'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Profile 3
          </Link>

          <Link
            to={'/profil/4'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Profile 4
          </Link>

          <Link
            to={'/profil/5'}
            onClick={() => {
              setNavbarState(false);
            }}
          >
            Profile 5
          </Link>
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
      // <button className={"navbar-close fa-solid fa-bars"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(true)}}></button>
    );
};

export default NavBar;
