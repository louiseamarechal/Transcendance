// librairies
import { Routes, Route } from 'react-router-dom';
// import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx';
import Game from './pages/Game.tsx';
import Chat from './pages/Chat.tsx';
import Friends from './pages/Friends.tsx';
import Settings from './pages/Settings.tsx';
import Profil from './pages/Profil.tsx';
import Components from './pages/Components.tsx';
import Callback from './pages/Callback.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import NavBar from './components/NavBar.tsx';
import useNavbar from './hooks/useNavbar.ts';

// CSS
import './style/components/buttons.css';
import './style/components/avatar.css';
import './style/pages/color.css';
import './style/pages/App.css';
import FoundGamePage from './pages/Game/FoundGamePage.tsx';

function App() {
  const { navbarState } = useNavbar();

  return (
    <div className="app">
      <NavBar />
      <div
        className={
          'h-screen overflow-auto main-content ' +
          (navbarState ? 'opened-nav-margin' : 'w-full')
        }
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/callback" element={<Callback />} />
          {/* PROTECTED ROUTES */}
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/game" element={<Game />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/test" element={<Components />} />
          <Route path="/foundgame" element={<FoundGamePage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
