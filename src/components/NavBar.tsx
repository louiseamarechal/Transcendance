import React, { useState } from "react";
import '../style/components/navbar.css'

const NavBar = () => {

    const [navbarState, setNavbarState] = useState(true); 

    if (navbarState === true)
        return (
            <div className="navbar-open">
                <button className={"opened-nav-button fa-solid fa-xmark"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(false)}}></button>
                <ul className="navbar-links">
                    <img className="avatar" alt="avatar" src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" />
                    <li>Game</li>
                    <li>Chat</li>
                    <li>Friends</li>
                    <li>Settings</li>
                </ul>
            </div>
        )
    else
        return (
            <button className={"navbar-close fa-solid fa-bars"} style={{color:"var(--black)"}} onClick={() => {setNavbarState(true)}}></button>
        )
}

export default NavBar;