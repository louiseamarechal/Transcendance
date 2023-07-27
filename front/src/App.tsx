// librairies
import { Routes, Route } from 'react-router-dom';
// import React from 'react'

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx';
import Chat from './pages/Chat.tsx';
import Friends from './pages/Friends.tsx';
import Profil from './pages/Profil.tsx';
import FindFriends from './pages/FindFriends.tsx';
import Components from './pages/Components.tsx';
import Callback from './pages/Callback.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import NavBar from './components/NavBar.tsx';
import useNavbar from './hooks/useNavbar.ts';

// CSS
import './style/color.css'
import './style/components/buttons.css';
import './style/components/avatar.css';
import './style/color.css';
import './style/pages/App.css';
import './style/components/notification.css';
import GameLayout from './pages/Game/GameLayout.tsx';
import OldGame from './pages/OldGame/OldGame.tsx';
import OldWaitingForGame from './pages/OldGame/OldWaitingForGamePage.tsx';
import OldPlayGame from './pages/OldGame/OldPlayGame.tsx';
import OldGameLobby from './pages/OldGame/OldGameLobby.tsx';
import GameLobby from './pages/Game/GameLobby.tsx';
import GameQueue from './pages/Game/GameQueue.tsx';
import GameGame from './pages/Game/GameGame.tsx';

function App() {

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
          <Route path="/" Component={WelcomePage} />
          <Route path="/callback" Component={Callback} />
          {/* PROTECTED ROUTES */}
          <Route Component={RequireAuth}>
            <Route path="/oldgame" Component={OldGame}>
              <Route index Component={OldGameLobby} />
              <Route path="/oldgame/oldplaygame" Component={OldPlayGame} />
              <Route path="/oldgame/oldwait" Component={OldWaitingForGame} />
            </Route>
            <Route path="/game" Component={GameLayout}>
              <Route index Component={GameLobby} />
              <Route path="queue" Component={GameQueue} />
              <Route path=":gameId" Component={GameGame} />
            </Route>
            <Route path="/chat" Component={Chat} />
            <Route path="/friends" Component={Friends} />
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
