import { useEffect } from 'react';
import { notifSocket } from '../../api/socket';

type NotificationProps = {
  element: string;
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

export function Notification(props: NotificationProps) {
  useEffect(() => {
    function onFriendsNotifEvent() {
      console.log('received FR notif');
      props.setReceivedNotif((previous) => {
        return { ...previous, friends: previous.friends + 1 };
      });
    }
    function onGameNotifEvent() {
      console.log('received Game notif');
      props.setReceivedNotif((previous) => {
        return { ...previous, game: previous.game + 1 };
      });
    }
    function onChatNotifEvent() {
      console.log('received Chat notif');
      props.setReceivedNotif((previous) => { return {...previous, chat: 1} });
    }

    if (notifSocket && props.element === 'Friends') {
      notifSocket.on('friends-notif', onFriendsNotifEvent);
    }

    if (notifSocket && props.element === 'Game') {
      notifSocket.on('game-notif', onGameNotifEvent);
    }

    if (notifSocket && props.element === 'Chat') {
      notifSocket.on('chat-notif', onChatNotifEvent);
    }

    return () => {
      notifSocket?.off('friends-notif', onFriendsNotifEvent);
      notifSocket?.off('game-notif', onGameNotifEvent);
      notifSocket?.off('chat-notif', onChatNotifEvent);
    };
  }, []);

  if (props.receivedNotif.friends > 0 && props.element === 'Friends') {
    return (
      <div className="notification">
        <div className="notification-text">{props.receivedNotif.friends}</div>
      </div>
    );
  } else if (props.receivedNotif.game > 0 && props.element === 'Game') {
    console.log(props.receivedNotif.game);
    return (
      <div className="notification">
        <div className="notification-text">{props.receivedNotif.game}</div>
      </div>
    );
    } else if (props.receivedNotif.chat > 0 && props.element === 'Chat') {
      return (
        <div className="notification">
          <div className="notification-text">{props.receivedNotif.chat}</div>
        </div>
      );
  }
  return <></>;
}
