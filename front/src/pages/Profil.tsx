// import React from "react";
import NavBar from "../components/NavBar.tsx";
import { ProfilStat } from "../components/ProfilStat.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import UserCard from "../components/UserCard.tsx";
import "../style/pages/Profil.css";

function Profil() {
  // Profil page will depend on the user id => see later on

  return (
    <div className="h-screen">
      <NavBar />
      {/* <div className="profil-container content-center"> */}
      <div className="h-screen grid grid-cols-1">
        <UserCard />
        <ProgressBar />
        <ProfilStat />
      </div>
    </div>
  );
}

export default Profil;
