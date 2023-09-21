// librairies
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// TypeScript
import WelcomePage from './pages/WelcomePage.tsx';
// import Chat from './pages/Chat.tsx';
import Friends from './pages/Friends.tsx';
import Profil from './pages/Profil.tsx';
import FindFriends from './pages/FindFriends.tsx';
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
import GameGame from './pages/game/GameGame.tsx';

import UserProfile from './pages/UserProfile.tsx';
import TwoFApage from './pages/2FApage.tsx';
import GameSearch from './pages/game/GameSearch.tsx';
import GameCreate from './pages/game/GameCreate.tsx';
import ChatLayout from './pages/chat/ChatLayout.tsx';
import ChatCreate from './pages/chat/ChatCreate.tsx';
import ChatChannel from './pages/chat/ChatChannel.tsx';
import ChannelMessaging from './pages/chat/chat-channel/ChannelMessaging.tsx';
import ChannelMembers from './pages/chat/chat-channel/channel-options/ChannelMembers.tsx';
import ChannelOptions from './pages/chat/chat-channel/ChannelOptions.tsx';
import ChannelSettings from './pages/chat/chat-channel/channel-options/ChannelSettings.tsx';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" Component={WelcomePage} />,
      <Route path="/callback" Component={Callback} />,
      <Route path="/2FApage" Component={TwoFApage} />,
      // PROTECTED ROUTES
      <Route Component={RequireAuth}>
        <Route path="/oldgame" Component={OldGame}>
          <Route index Component={OldGameLobby} />
          <Route path="/oldgame/oldplaygame" Component={OldPlayGame} />
          <Route path="/oldgame/oldwait" Component={OldWaitingForGame} />
        </Route>
        <Route path="/game" Component={GameLayout}>
          <Route index Component={GameLobby} />
          <Route path="search" Component={GameSearch} />
          <Route path="create" Component={GameCreate} />
          <Route path=":gameId" Component={GameGame} />
        </Route>
        <Route path="/chat" Component={ChatLayout}>
          <Route index Component={() => <div className="w-full" />} />
          <Route path="create" Component={ChatCreate} />
          <Route path=":channelId" Component={ChatChannel}>
            <Route index Component={ChannelMessaging} />
            <Route path="options" Component={ChannelOptions}>
              <Route path="members" Component={ChannelMembers}>
                {/* <Route path="add" Component={AddMember} /> */}
              </Route>
              <Route path="settings" Component={ChannelSettings} />
            </Route>
          </Route>
        </Route>
        <Route path="/friends" Component={Friends} />
        <Route path="/profil" Component={Profil} />
        <Route path="/profil/:profileId" Component={UserProfile} />
        <Route path="/findfriends" Component={FindFriends} />
      </Route>,
    ]),
  );

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
