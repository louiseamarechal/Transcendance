import React from 'react'
import Reveal from '../components/Reveal.tsx'
import '../style/pages/WelcomePage.css'
import NavBar from '../components/NavBar.tsx'

// NavBar ne sera pas sur cette page, mais plus facile de circuler sur le site comme ca en attendant

function WelcomePage() {

    return (
      <Reveal width={'100%'}>
        <NavBar/>
        <div className='h-screen welcome-page flex flex-col justify-center items-center gap-y-20'>
          <div>
            <h1>Transcendance</h1>
          </div>
          <div className='signin-button flex flex-col justify-center content-center gap-y-10'>
              <button>Sign in</button>
              <button>Sign in with 42</button>
          </div>
        </div>
      </Reveal>
    )
  }
  
  export default WelcomePage