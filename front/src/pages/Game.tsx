// import React from 'react'
import NavBar from '../components/NavBar.tsx';
import '../style/components/net.css'
import '../style/components/buttons.css'
import '../style/pages/Game.css'

function Game() {
    return (
      <>
        <NavBar />
        <div className="h-screen flex flex-col items-center game-page">
          <h1 >PONG</h1>
          <div className="flex flex-col items-center"></div>
          <div className="flex justify-center items-center">
            <button className="searchgame-button ">Search Game</button>
            <div className="net w-100px"></div>
            <button className="searchgame-button">Invite Friends</button>
          </div>
        </div>
      </>
    );
  }
  
  export default Game;
  