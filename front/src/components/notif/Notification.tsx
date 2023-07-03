import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export function DisplayNotification({element}: {element: string}) {
  const [gameNotif, setGameNotif] = useState(0);
  const axiosInstance = useAxiosPrivate();

  useEffect(() => {
    axiosInstance.get('friend-request/received').then((response) => {
      setGameNotif(response.data.length());
    });
  });

  if (element === 'Game' && gameNotif > 0) {
    return (
      <div className="notification">
        <div className="notification-text">{gameNotif}</div>
      </div>
    );
    // return <Notification props={gameNotif.length()} />;
  } else {
    return <></>;
  }
}

// const Notification = (notifNb: number) => {
//   return (
//     <div className="notification">
//       <div className="notification-text">`${notifNb}`</div>
//     </div>
//   );
// };

// export default Notification;
