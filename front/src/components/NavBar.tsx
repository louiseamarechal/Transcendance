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
    return <></>;
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
          <Link to={'/profil'}>
            <img className="avatar" alt="avatar" src={myAvatar} />
          </Link>
          <Link to={'/game'}>Game</Link>
          <Link to={'/chat'}>Chat</Link>
          <Link to={'/friends'}>Friends</Link>
          <Link to={'/test'}>Test</Link>
          <Link to={'/FindFriends'}>FindFriends</Link>
          <Link to={'/profil/1'}>Profile 1</Link>
          <Link to={'/profil/2'}>Profile 2</Link>
          <Link to={'/profil/3'}>Profile 3</Link>
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
