// librairies
import { Routes, Route } from 'react-router-dom';

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx';
import Chat from './pages/Chat.tsx';
import Friends from './pages/Friends.tsx';
import Profil from './pages/Profil.tsx';
import FindFriends from './pages/FindFriends.tsx';
import Components from './pages/Components.tsx';
import Callback from './pages/Callback.tsx';
import RequireAuth from './components/RequireAuth.tsx';

// CSS
import './style/color.css';
import './style/components/buttons.css';
import './style/components/avatar.css';
import './style/color.css';
import './style/pages/App.css';
import './style/components/notification.css';

import OldGame from './pages/OldGame/OldGame.tsx';
import OldWaitingForGame from './pages/OldGame/OldWaitingForGamePage.tsx';
import OldPlayGame from './pages/OldGame/OldPlayGame.tsx';
import OldGameLobby from './pages/OldGame/OldGameLobby.tsx';

import GameLayout from './pages/game/GameLayout.tsx';
import GameLobby from './pages/game/GameLobby.tsx';
import GameQueue from './pages/game/GameQueue.tsx';
import GameGame from './pages/game/GameGame.tsx';

import UserProfile from './pages/UserProfile.tsx';
import TwoFApage from './pages/2FApage.tsx';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" Component={WelcomePage} />
        <Route path="/callback" Component={Callback} />
        <Route path="/2FApage" Component={TwoFApage} />
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
  );
}

export default App;
