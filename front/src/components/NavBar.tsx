// import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import '../style/components/navbar.css';
import useNavbar from '../hooks/useNavbar';
import { useUser } from '../hooks/useUser';

const NavBar = () => {
  const { navbarState, setNavbarState } = useNavbar();
  const { avatar } = useUser();

  if (!avatar) {
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
            <img
              className="avatar"
              alt="avatar"
              src={avatar}
            />
          </Link>
          <Link to={'/game'}>Game</Link>
          <Link to={'/chat'}>Chat</Link>
          <Link to={'/friends'}>Friends</Link>
          <Link to={'/settings'}>Settings</Link>
          <Link to={'/test'}>Test</Link>
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
