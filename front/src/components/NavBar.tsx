import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useNavbar from '../hooks/useNavbar';
import NavBarLinks from './NavBarLinks';

import '../style/components/navbar.css';
import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useNotif from '../hooks/useNotif';

const NavBar = () => {
  const navbar = useNavbar();
  const axiosInstance = useAxiosPrivate();
  const notif = useNotif();

  useEffect(() => {
    axiosInstance
      .get('/notif/friend')
      .then((response) => {
        const data = response.data;
        notif.reset('friends');
        notif.increment('friends', data.length);
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get('/notif/game')
      .then((response) => {
        const data = response.data;
        notif.reset('game');
        notif.increment('game', data.length);
      })
      .catch((error) => console.log(error));

    // axiosInstance
    // .get('/notif/chat')
    // .then((response) => {
    //   const data = response.data;
    //   notif.reset('chat');
    //   notif.increment('chat', data.length);
    // })
    // .catch((error) => console.log(error));
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
        <NavBarLinks />
      </div>
    );
  else
    return (
      <>
        <FontAwesomeIcon
          icon={faBars}
          className="navbar-close"
          style={{ color: 'var(--black)' }}
          onClick={() => {
            navbar.toggle(true);
          }}
        />
        <NavBarLinks />
      </>
    );
};

export default NavBar;
