import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useNavbar from '../hooks/useNavbar';
import NavBarLinks from './NavBarLinks';

import '../style/components/navbar.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const NavBar = () => {
  const navbar = useNavbar();
  const axiosInstance = useAxiosPrivate();
  const [receivedNotif, setReceivedNotif] = useState({
    friends: 0,
    game: 0,
    chat: 0,
  });

  useEffect(() => {
    axiosInstance
      .get('/notif/friend')
      .then((response) => {
        const data = response.data;
        setReceivedNotif((previous) => {
          return { ...previous, friends: data.length };
        });
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get('/notif/game')
      .then((response) => {
        const data = response.data;
        setReceivedNotif((previous) => {
          return { ...previous, game: data.length };
        });
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get('/notif/chat')
      .then((response) => {
        const data = response.data;
        setReceivedNotif((previous) => {
          return { ...previous, game: data.length };
        });
      })
      .catch((error) => console.log(error));
  }, []);

  if (navbar.navbarState === true)
    return (
      <div className="navbar-open">
        <FontAwesomeIcon
          icon={faXmark}
          className="opened-nav-button"
          style={{ color: 'var(--black)' }}
          onClick={() => {
            navbar.toggle(false);
          }}
        />
        <NavBarLinks
          receivedNotif={receivedNotif}
          setReceivedNotif={setReceivedNotif}
        />
      </div>
    );
  else
    return (
      <FontAwesomeIcon
        icon={faBars}
        className="navbar-close"
        style={{ color: 'var(--black)' }}
        onClick={() => {
          navbar.toggle(true);
        }}
      />
    );
};

export default NavBar;
