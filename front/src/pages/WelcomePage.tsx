// import React from 'react'
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
              {/* <button>Sign in with 42</button> */}
              {/* <>Sign in with 42</button> */}
              <a href="https://api.intra.42.fr/oauth/authorize?client_id=e3cc4cd2c2bc7e57508c0ecc27b9dff133d03b28aaa52949357ca4e0310539fd&redirect_uri=https%3A%2F%2Fwww.qwant.com%2F&response_type=code"><button>Sign in with 42</button></a>
          </div>
        </div>
      </Reveal>
    )
  }
  
  export default WelcomePage