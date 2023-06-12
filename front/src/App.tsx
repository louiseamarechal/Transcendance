// librairies
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx'
import Game from './pages/Game.tsx'
import Chat from './pages/Chat.tsx'
import Friends from './pages/Friends.tsx'
import Settings from './pages/Settings.tsx'
import Profil from './pages/Profil.tsx'
import Components from './pages/Components.tsx' 
import Callback from './components/Callback.tsx'

// CSS
import './style/components/buttons.css'
import './style/pages/color.css'
import './style/pages/App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/game' element={<Game />} />
          <Route path='/profil' element={<Profil />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/callback' element={<Callback />} />
          <Route path='/test' element={<Components />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App