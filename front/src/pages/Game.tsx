// import React from 'react'
import NavBar from '../components/NavBar.tsx';
import useAuth from '../hooks/useAuth.tsx';


function Game() {

    const { auth } = useAuth();

    console.log({ auth_refresh_token: auth.refresh_token });
    console.log({ auth_access_token: auth.access_token});

    return (
        <>
            <NavBar/>
            <div className='h-screen flex justify-center items-center'>Game Page in progress</div>
        </>
    )
}

export default Game;