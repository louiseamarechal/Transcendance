import React from 'react'
import Reveal from './components/reveal.tsx'
import './App.css'

function App() {

return (
  <Reveal>
    <div className='h-screen homepage flex flex-col justify-center items-center gap-y-20'>
      <div>
        <h1>Transcendance</h1>
      </div>
      <div className='signing-option flex flex-col justify-center content-center gap-y-10'>
          <button>Sign in</button>
          <button>Sign in with 42</button>
      </div>
    </div>
  </Reveal>
)
}

export default App