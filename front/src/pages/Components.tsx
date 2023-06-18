// import React from 'react'
import NavBar from '../components/NavBar.tsx';
import ProgressBar from '../components/ProgressBar.tsx';
import UserCard from '../components/UserCard.tsx';
import '../style/components/net.css'

const user = {
    name: 'toto',
    avatar: 'http://localhost:3000/public/default.jpg',
    level: 99999
}

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
                    <button className='decline-game'>X</button>
                    <ProgressBar completed={"15"}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    <UserCard user={user}/>
                    {/* <button className='fa-solid fa-circle-play fa-xl' style={{color: "var(--black)"}}></button> */}
                    {/* <div>
                        <div className="net w-200px"></div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Components;