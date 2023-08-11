import { Notification } from './notif/Notification';
import { useUser } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import useNavbar from '../hooks/useNavbar';
import Avatar from './Avatar';
import useNotif from '../hooks/useNotif';

const NavBarLinks = () => {
  const { myId } = useUser();
  const { navbarState, setNavbarState } = useNavbar();
  const notif = useNotif();

  function handleClick(
    link:
      | string
      | React.DetailedHTMLProps<
          React.ImgHTMLAttributes<HTMLImageElement>,
          HTMLImageElement
        >,
  ) {
    if (link === 'Game') {
      notif.reset('game');
    } else if (link === 'Friends') {
      notif.reset('friends');
    } else if (link === 'Chat') {
      notif.reset('chat');
    }
    setNavbarState(false);
  }

  const navElems = [
    { to: '/profil', content: <Avatar id={myId} /> },
    { to: '/game', content: 'Game' },
    { to: '/oldgame', content: 'OldGame' },
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

  if (navbarState === true) {
    return (
      <ul className="navbar-links">
        {navElems.map((elem, index) => {
          return (
            <div className="relative" key={index}>
              {typeof elem.content === 'string' ? (
                <Notification element={elem.content} />
              ) : (
                ''
              )}
              <Link to={elem.to} onClick={() => handleClick(elem.content)}>
                {elem.content}
              </Link>
            </div>
          );
        })}
      </ul>
    );
  }
  return (
    <>
      {navElems.map((elem, index) => {
        return (
          <>
            {typeof elem.content === 'string' ? (
              <Notification element={elem.content} />
            ) : (
              ''
            )}
          </>
        );
      })}
    </>
  );
};

export default NavBarLinks;
