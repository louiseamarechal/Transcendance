// librairies
import { Routes, Route } from 'react-router-dom';
// import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx';
import Game from './pages/Game/Game.tsx';
import Chat from './pages/Chat.tsx';
import Friends from './pages/Friends.tsx';
import Profil from './pages/Profil.tsx';
import FindFriends from './pages/FindFriends.tsx';
import Components from './pages/Components.tsx';
import Callback from './pages/Callback.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import NavBar from './components/NavBar.tsx';
import useNavbar from './hooks/useNavbar.ts';
import PlayGame from './pages/Game/PlayGame.tsx';
import WaitingForGame from './pages/Game/WaitingForGamePage.tsx';
import FoundGamePage from './pages/Game/FoundGamePage.tsx';
import GameLobby from './pages/Game/GameLobby.tsx';
import UserProfile from './pages/UserProfile.tsx';

// CSS
import './style/components/buttons.css';
import './style/components/avatar.css';
import './style/pages/color.css';
import './style/pages/App.css';
import './style/components/notification.css'

function App() {
  const { navbarState } = useNavbar();

  return (
    <div className="app">
      {/* <NotifSocket /> */}
      <div
        className={
          'h-screen overflow-auto main-content ' +
          (navbarState ? 'opened-nav-margin' : 'w-full')
        }
      >
        <Routes>
          <Route path="/" Component={WelcomePage} />
          <Route path="/callback" Component={Callback} />
          {/* PROTECTED ROUTES */}
          <Route Component={RequireAuth}>
          <Route path="/game" Component={Game}>
            <Route index Component={GameLobby} />
            <Route path="/game/playgame" Component={PlayGame} />
            <Route path="/game/foundgame" Component={FoundGamePage} />
            <Route path="/game/wait" Component={WaitingForGame} />
          </Route>
          <Route path="/chat" Component={Chat} />
          <Route path="/friends" Component={Friends} />
          <Route path="/game" Component={Game} />
          <Route path="/profil" Component={Profil} />
          <Route path="/profil/:id" Component={UserProfile} />
          <Route path="/test" Component={Components} />
          <Route path="/findfriends" Component={FindFriends} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
