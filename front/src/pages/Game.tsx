// import React from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate.ts";
import NavBar from '../components/NavBar.tsx';
import '../style/components/net.css'
import '../style/components/buttons.css'
import '../style/pages/Game.css'
import useAuth from '../hooks/useAuth.ts';
// import useRefreshToken from '../hooks/useRefreshToken.ts';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
// import useAxiosPrivate from "../hooks/useAxiosPrivate.ts";

function Game() {

  const axiosPrivate = useAxiosPrivate();

  const getUser = async () => {
    const reponse = await axiosPrivate.get('/user/me');
    console.log(reponse);
  };  
  return (
      <>
        <NavBar />
        <button onClick={() => getUser()}>User</button>
        <div className="gamepage-container">
          <h1 className="gamepage-title">PONG</h1>
          <div className="net-container">
            <div className="net"></div>
            {/* <div className="flex justify-center" style={{ marginTop: '15%' }}> */}
            <button className="searchgame-button mr-2"style={{ marginRight: '40%' }}>Search Game</button>
            <button className="searchgame-button m1-2"style={{ marginLeft: '40%' }}>Invite Friends</button>
          <div className="net w-100px mb-4"></div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  }
  
  export default Game;
  

