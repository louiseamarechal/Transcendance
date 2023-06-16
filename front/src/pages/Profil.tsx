// import React from "react";
import NavBar from "../components/NavBar.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import UserCard from "../components/UserCard.tsx";
import "../style/pages/Profil.css";

function Profil() {
  // Profil page will depend on the user id => see later on

  return (
    <>
      <NavBar />
      {/* <div className='h-screen flex justify-center items-center'>Profil Page in progress</div> */}
      <div className="profil-container">
        <UserCard />
        <ProgressBar />
      </div>
    </>
  );
}

export default Profil;
