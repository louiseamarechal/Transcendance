// import React, { useState } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import '../style/components/navbar.css'

const NavBar = () => {

    const [navbarState, setNavbarState] = useState(false); 

    if (navbarState === true)
        return (
            <div className="navbar-open">
                <button className={"opened-nav-button fa-solid fa-xmark"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(false)}}></button>
                <ul className="navbar-links">
                    <Link to={'/profil'}><img className="avatar" alt="avatar" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" /></Link>
                    <Link to={'/game'}>Game</Link>
                    <Link to={'/chat'}>Chat</Link>
                    <Link to={'/friends'}>Friends</Link>
                    <Link to={'/settings'}>Settings</Link>
                    <Link to={'/test'}>Test</Link>
                </ul>
            </div>
        )
    else
        return (
            <button className={"navbar-close fa-solid fa-bars"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(true)}}></button>
        )
}

export default NavBar;