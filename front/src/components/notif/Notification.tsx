import { useEffect } from 'react';
import { notifSocket } from '../../api/socket';
import useNotif from '../../hooks/useNotif';
import useNavbar from '../../hooks/useNavbar';

type NotificationProps = {
  element: string;
};

export function Notification(props: NotificationProps) {
  const {navbarState} = useNavbar();
  const notif = useNotif();
  useEffect(() => {
    function onFriendsNotifEvent() {
      console.log('received FR notif');
      notif.increment('friends', 1);
    }
    function onGameNotifEvent() {
      notif.increment('game', 1);
    }
    function onChatNotifEvent() {
      notif.increment('chat', 1);
    }

    if (notifSocket && props.element === 'Friends') {
      notifSocket.on('server.notif.friends', onFriendsNotifEvent);
    }

    if (notifSocket && props.element === 'Game') {
      notifSocket.on('server.notif.game', onGameNotifEvent);
    }

    if (notifSocket && props.element === 'Chat') {
      notifSocket.on('server.notif.chat', onChatNotifEvent);
    }

    return () => {
      notifSocket?.off('server.notif.friends', onFriendsNotifEvent);
      notifSocket?.off('server.notif.game', onGameNotifEvent);
      notifSocket?.off('server.notif.chat', onChatNotifEvent);
    };
  }, []);

  if (navbarState === true) {
    if (notif.notif.friends > 0 && props.element === 'Friends') {
      return (
        <div className="notification">
          <div className="notification-text">{notif.notif.friends}</div>
        </div>
      );
    } else if (notif.notif.game > 0 && props.element === 'Game') {
      return (
        <div className="notification">
          <div className="notification-text">{notif.notif.game}</div>
        </div>
      );
    } else if (notif.notif.chat > 0 && props.element === 'Chat') {
      return (
        <div className="notification">
          <div className="notification-text">{notif.notif.chat}</div>
        </div>
      );
    }
  }
  return <></>;
}
