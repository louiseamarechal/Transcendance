import React from 'react'
import NavBar from '../components/NavBar.tsx';
import ProgressBar from '../components/ProgressBar.tsx';

function Components() {

    return (
        <>
            <div className='h-screen'>
                <NavBar/>
                <div className='h-screen flex flex-col justify-center items-center gap-y-2'>
                    <button className='small-button friend-request-button'>Send friend request</button>
                    <button className='small-button game-request-button'>Send game request</button>
                    <button className='small-button friend-button'>Friends</button>
                    <button className='play-game-button flex justify-center items-center'>
                        <div className='play-game-triangle'></div>
                    </button>
                    <ProgressBar completed={"15"}/>
                    {/* <button className='fa-solid fa-circle-play fa-xl' style={{color: "var(--black)"}}></button> */}
                </div>
            </div>
        </>
    )
}

export default Components;