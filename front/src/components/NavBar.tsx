// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


import '../style/components/navbar.css'
import useNavbar from "../hooks/useNavbar";


const NavBar = () => {

    const { navbarState, setNavbarState } = useNavbar(); 

    if (location.pathname === '/')
        return;
    if (navbarState === true)
        return (
            <div className="navbar-open">
                <FontAwesomeIcon icon={ faXmark } className="opened-nav-button" style={{color:"var(--black)"}} onClick={() => {setNavbarState(false)}}/>
                {/* <button className={"opened-nav-button fa-solid fa-xmark"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(false)}}></button> */}
                <ul className="navbar-links">
                    <Link to={'/profil'}><img className="avatar" alt="avatar" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" onClick={() => {setNavbarState(false)}}/></Link>
                    <Link to={'/game'} onClick={() => {setNavbarState(false)}}>Game</Link>
                    <Link to={'/chat'} onClick={() => {setNavbarState(false)}}>Chat</Link>
                    <Link to={'/friends'} onClick={() => {setNavbarState(false)}}>Friends</Link>
                    <Link to={'/settings'} onClick={() => {setNavbarState(false)}}>Settings</Link>
                    <Link to={'/test'} onClick={() => {setNavbarState(false)}}>Test</Link>
                </ul>
            </div>
        )
    else
        return (
            <FontAwesomeIcon icon={ faBars } className="navbar-close" style={{color:"var(--black)"}} onClick={() => {setNavbarState(true)}}/>
            // <button className={"navbar-close fa-solid fa-bars"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(true)}}></button>
        )
}

export default NavBar;