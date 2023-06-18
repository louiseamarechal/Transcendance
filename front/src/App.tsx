// librairies
import { Routes, Route } from 'react-router-dom'
// import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx'
import Game from './pages/Game.tsx'
import Chat from './pages/Chat.tsx'
import Friends from './pages/Friends.tsx'
import Settings from './pages/Settings.tsx'
import Profil from './pages/Profil.tsx'
import Components from './pages/Components.tsx' 
import Callback from './pages/Callback.tsx'
import RequireAuth from './components/RequireAuth.tsx'

// CSS
import './style/components/buttons.css'
import './style/pages/color.css'
import './style/pages/App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path='/callback' element={<Callback />} />

        {/* PROTECTED ROUTES */}
        <Route element={<RequireAuth />}>
          <Route path='/chat' element={<Chat />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/game' element={<Game />} />
          <Route path='/profil' element={<Profil />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/test' element={<Components />} />
        </Route>

      </Routes>
    </>
  )
}

export default App