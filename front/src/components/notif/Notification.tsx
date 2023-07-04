import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Socket } from 'socket.io-client';

type DisplayNotificationProps = {
  element: string;
  notifSocket: Socket | undefined;
};

export function DisplayNotification(props: DisplayNotificationProps) {
  const [friendNotif, setFriendNotif] = useState(0);
  const axiosInstance = useAxiosPrivate();

  useEffect(() => {
    axiosInstance.get('friend-request/received').then((response) => {
      setFriendNotif(response.data.length());
    });
  });

  if (props.notifSocket) {
    props.notifSocket.on('friends-notif', () => {
      // if (props.element === 'Friends') {
        console.log('received FR notif');
        return (
          <div className="notification">
            <div className="notification-text">{friendNotif}</div>
          </div>
        );
      // } else {
      //   return <></>;
      // }
    });
  }
  console.log('trop dur');
  return <></>;
  // if (element === 'Game' && gameNotif > 0) {
  //   return (
  //     <div className="notification">
  //       <div className="notification-text">{gameNotif}</div>
  //     </div>
  //   );
  //   // return <Notification props={gameNotif.length()} />;
  // } else {
  //   return <></>;
  // }
}
