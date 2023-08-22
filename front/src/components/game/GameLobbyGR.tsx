import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import MiniUserCard from '../MiniUserCard';
import { GameRequest } from '../../../../shared/common/types/game.type';

function GameLobbyGR() {
  const axiosInstance = useAxiosPrivate();
  const [gameRequests, setGameRequests] = useState<GameRequest[]>([]);

  useEffect(() => {
    axiosInstance
      .get('game/myGameRequests')
      .then((res) => {
        setGameRequests(res.data);
      })
      .catch(() => {
        console.log("get('game/myGameRequests') failed");
      });
  }, []); // add dependency: game notif to refresh when new game notif

  function handleGRAccept() {
    // gameSocket.emit(ClientEvents.GameAcceptGR);
  }
  function handleGRRefuse() {
    // gameSocket.emit(ClientEvents.GameRefuseGR);
  }

  if (gameRequests.length === 0) {
    return null;
  }

  return (
    <>
      <div>You have game requests: </div>
      <div className="flex-row-center flex-wrap">
        {gameRequests.map((gr) => {
          return (
            <div
              className=" flex-col-center w-40 border-2 border-purple-500"
              key={gr.gameId}
            >
              <MiniUserCard user={gr.p1} />
              <button onClick={handleGRAccept}>Accept</button>
              <button onClick={handleGRRefuse}>Refuse</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default GameLobbyGR;
