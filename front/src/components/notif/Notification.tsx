import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

type DisplayNotificationProps = {
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

export function DisplayNotification(props: DisplayNotificationProps) {

  useEffect(() => {
    function onFriendsNotifEvent() {
      console.log('received FR notif');
      props.setReceivedNotif((previous) => {
        return { ...previous, friends: previous.friends + 1 };
      });
    }
    // function onGameNotifEvent() {
    //   console.log('received FR notif');
    //   setReceivedNotif((previous) => { return {...previous, game: 1} });
    // }
    // function onChatNotifEvent() {
    //   console.log('received FR notif');
    //   setReceivedNotif((previous) => { return {...previous, chat: 1} });
    // }

    if (props.notifSocket && props.element === 'Friends') {
      props.notifSocket.on('friends-notif', onFriendsNotifEvent);
      // props.notifSocket.on('game-notif', onGameNotifEvent);
      // props.notifSocket.on('chat-notif', onChatNotifEvent);
    }

    return () => {
      props.notifSocket?.off('friends-notif', onFriendsNotifEvent);
    };
  }, []);

  if (props.receivedNotif.friends > 0 && props.element === 'Friends') {
    return (
      <div className="notification">
        <div className="notification-text">{props.receivedNotif.friends}</div>
      </div>
    );
  }
  return <></>;
}
