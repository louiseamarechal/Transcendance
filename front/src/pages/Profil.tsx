// import React from "react";
import NavBar from "../components/NavBar.tsx"
import '../style/pages/Profil.css'
import UserCard from '../components/UserCard.tsx';
import ProgressBar from '../components/ProgressBar.tsx';

function Profil() {

    // Profil page will depend on the user id => see later on

    return (
        <>
            <NavBar/>
            <div className="profil-container">
            <UserCard/>
            <ProgressBar completed={"15"}/>
            <div className="profil-tab">
                <div className="profil-stat">
                    victoires: 55
                </div>
            </div>
            </div>
        </>
    )
}

export default Profil;