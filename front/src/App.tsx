// librairies
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// CSS
import './style/color.css';
import './style/components/buttons.css';
import './style/components/avatar.css';
import './style/components/net.css';
import './style/components/notification.css';
import './style/pages/App.css';
import './style/pages/Game.css';
import './style/pages/Profil.css';
import './style/pages/2FApage.css';
import './style/pages/WelcomePage.css';
import './style/components/spinner.css';
import './style/pages/FindFriends.css';
import './style/pages/Friends.css';
import './style/components/chat/chat-container/chat-messaging/chat-body.css';

import WelcomePage from './pages/core/WelcomePage.tsx';
import Callback from './pages/core/Callback.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import TwoFApage from './pages/core/2FApage.tsx';
import FirstConnection from './pages/core/FirstConnection.tsx';

import Profil from './pages/profile/Profil.tsx';
import UserProfile from './pages/profile/UserProfile.tsx';
import Friends from './pages/friends/Friends.tsx';
import FindFriends from './pages/friends/FindFriends.tsx';

import GameLayout from './pages/game/GameLayout.tsx';
import GameLobby from './pages/game/GameLobby.tsx';
import GameGame from './pages/game/GameGame.tsx';
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
        <Route path="/first-connection" Component={FirstConnection} />
        <Route path="/profil" Component={Profil} />
        <Route path="/profil/:profileId" Component={UserProfile} />
        <Route path="/friends" Component={Friends} />
        <Route path="/findfriends" Component={FindFriends} />

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
