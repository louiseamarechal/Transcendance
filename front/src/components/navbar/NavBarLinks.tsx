import { Notification } from '../notif/Notification';
import { useUser } from '../../hooks/useUser';
import { Link } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import Avatar from '../ui/Avatar';
import useNotif from '../../hooks/useNotif';

const NavBarLinks = () => {
  const { myId } = useUser();
  const notif = useNotif();
  const navbar = useNavbar();

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
    navbar.toggle(false);
  }

  const navElems = [
    { to: '/profil', content: <Avatar id={myId} /> },
    { to: '/game', content: 'Game' },
    // { to: '/oldgame', content: 'OldGame' },
    { to: '/chat', content: 'Chat' },
    { to: '/friends', content: 'Friends' },
    { to: '/FindFriends', content: 'FindFriends' },
  ];

  if (navbar.navbarState === true) {
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
          <div key={index}>
            {typeof elem.content === 'string' ? (
              <Notification element={elem.content} />
            ) : (
              ''
            )}
          </div>
        );
      })}
    </>
  );
};

export default NavBarLinks;
