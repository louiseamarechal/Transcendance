// import React from 'react'
import Reveal from '../components/Reveal.tsx';
import '../style/pages/WelcomePage.css';

function WelcomePage() {
  const network = window.location.origin;
  const api_42 =
    // 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-afbf3e19b9a03a7b667ba62a6aa61a65ee7142d01a65f7f7ca36e725f5344415&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback&response_type=code';
    `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-afbf3e19b9a03a7b667ba62a6aa61a65ee7142d01a65f7f7ca36e725f5344415&redirect_uri=${network}/callback&response_type=code`;

  return (
    <>
      {/* <NavBar /> */}
      <Reveal width={'100%'}>
        <div className="h-screen welcome-page flex flex-col justify-center items-center gap-y-10">
          <div>
            <h1>Transcendance</h1>
          </div>
          <div className="signin-button flex flex-col justify-center content-center">
            <a href={api_42}>
              <button>Sign in with 42</button>
            </a>
          </div>
        </div>
      </Reveal>
    </>
  );
}

export default WelcomePage;
