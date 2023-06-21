// import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.ts';
// import useRefreshToken from '../hooks/useRefreshToken.ts';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
// import useAxiosPrivate from "../hooks/useAxiosPrivate.ts";

function Game() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  // console.log({ auth_refresh_token: auth.refresh_token });
  // console.log({ auth_access_token: auth.access_token });

  const getUser = async () => {
    const reponse = await axiosPrivate.get('/user/me');
    console.log(reponse);
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="h-screen flex justify-center items-center">
        Game Page in progress
      </div>
      <button onClick={() => getUser()}>User</button>
      <br/>
      <Link to='/wait'>Waiting Page</Link>
      <Link to='/foundgame'>found game</Link>
    </>
  );
}

export default Game;
