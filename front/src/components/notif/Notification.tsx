import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

type NotificationProps = {
  element: string;
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
    // function onChatNotifEvent() {
    //   console.log('received Chat notif');
    //   props.setReceivedNotif((previous) => { return {...previous, chat: 1} });
    // }

    if (props.notifSocket && props.element === 'Friends') {
      props.notifSocket.on('friends-notif', onFriendsNotifEvent);
    }

    if (props.notifSocket && props.element === 'Game') {
      props.notifSocket.on('game-notif', onGameNotifEvent);
    }

    // if (props.notifSocket && props.element === 'Chat') {
    //   props.notifSocket.on('chat-notif', onChatNotifEvent);
    // }

    return () => {
      props.notifSocket?.off('friends-notif', onFriendsNotifEvent);
      props.notifSocket?.off('game-notif', onGameNotifEvent);
      // props.notifSocket?.off('chat-notif', onChatNotifEvent);
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
    // } else if (props.receivedNotif.chat > 0 && props.element === 'Chat') {
    //   return (
    //     <div className="notification">
    //       <div className="notification-text">{props.receivedNotif.chat}</div>
    //     </div>
    //   );
  }
  return <></>;
}
