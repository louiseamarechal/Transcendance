import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function GameLobbyGR() {
  const axiosInstance = useAxiosPrivate();
  const [gameRequests, setGameRequests] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance
      .get('game/myGameRequests')
      .then((res) => {
        setGameRequests(res.data);
      })
      .catch(() => {
        console.log("get('game/myGameRequests') failed");
      });
  }, []);

  if (gameRequests.length === 0) {
    return null;
  }

  return (
    <>
      {gameRequests.map((gr) => {
        <div>{gr.gameId}</div>;
      })}
    </>
  );
}

export default GameLobbyGR;
