import { Socket } from 'socket.io-client';
import { Notification } from './notif/Notification';
import { useUser } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import useNavbar from '../hooks/useNavbar';

type NavBarLinksProps = {
  notifSocket: Socket | undefined;
  receivedNotif: {
    friends: number;
    game: number;
    chat: number;
  };
  setReceivedNotif: React.Dispatch<
    React.SetStateAction<{
      friends: number;
      game: number;
      chat: number;
    }>
  >;
};

const NavBarLinks = (props: NavBarLinksProps) => {
  const { myAvatar } = useUser();
  const { setNavbarState } = useNavbar();

  const navElems = [
    {
      to: '/profil',
      content: <img className="avatar" alt="avatar" src={myAvatar} />,
    },
    { to: '/game', content: 'Game' },
    { to: '/chat', content: 'Chat' },
    { to: '/friends', content: 'Friends' },
    { to: '/test', content: 'Test' },
    { to: '/FindFriends', content: 'FindFriends' },
    { to: '/profil/1', content: 'Profil 1' },
    { to: '/profil/2', content: 'Profil 2' },
    { to: '/profil/3', content: 'Profil 3' },
    { to: '/profil/4', content: 'Profil 4' },
    { to: '/profil/5', content: 'Profil 5' },
    { to: '/profil/6', content: 'Profil 6' },
    { to: '/profil/7', content: 'Profil 7' },
  ];

  if (!myAvatar) {
    return null;
  }

  return (
    <ul className="navbar-links">
      {navElems.map((elem, index) => {
        return (
          <div className="relative" key={index}>
            {typeof elem.content === 'string' ? (
              <Notification
                element={elem.content}
                notifSocket={props.notifSocket}
                receivedNotif={props.receivedNotif}
                setReceivedNotif={props.setReceivedNotif}
              />
            ) : (
              ''
            )}
            <Link to={elem.to} onClick={() => setNavbarState(false)}>
              {elem.content}
            </Link>
          </div>
        );
      })}
    </ul>
  );
};

export default NavBarLinks;