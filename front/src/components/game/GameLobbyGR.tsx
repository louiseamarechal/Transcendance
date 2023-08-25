import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import MiniUserCard from '../MiniUserCard';
import { GameRequest } from '../../../../shared/common/types/game.type';
import { gameSocket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';

function GameLobbyGR() {
  const axiosInstance = useAxiosPrivate();
  const [gameRequests, setGameRequests] = useState<GameRequest[]>([]);

  function fetchGameRequests() {
    axiosInstance
      .get('game/myGameRequests')
      .then((res) => {
        setGameRequests(res.data);
      })
      .catch(() => {
        console.log("get('game/myGameRequests') failed");
      });
  }

  useEffect(() => {
    fetchGameRequests();
  }, []); // add dependency: game notif to refresh when new game notif

  function handleGRAccept(gr: GameRequest) {
    console.log({ gr });
    gameSocket.emit(ClientEvents.GameAcceptGR, { gameId: gr.gameId });
  }
  function handleGRRefuse(gr: GameRequest) {
    console.log({ gr });
    gameSocket.emit(ClientEvents.GameRefuseGR, { gameId: gr.gameId });
    fetchGameRequests();
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
              <button onClick={() => handleGRAccept(gr)}>Accept</button>
              <button onClick={() => handleGRRefuse(gr)}>Refuse</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default GameLobbyGR;
