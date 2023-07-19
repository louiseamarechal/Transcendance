import { useParams } from 'react-router-dom';
import { socket } from '../../api/socket';

export type OverlayData = {
  p1ready?: boolean;
  p2ready?: boolean;
  timerval?: number;
};

type GameOverlayProps = {
  type: string;
  data: OverlayData;
};

function GameOverlay({ type, data }: GameOverlayProps) {
  const { gameId } = useParams();

  function handleReadyClick() {
    const payload: any = {
      gameId: gameId,
    };
    socket.emit('client.game.setReady', payload);
  }

  if (type === 'ready') {
    return (
      <div className="absolute border-4 border-fuchsia-300 w-full h-full flex flex-col justify-center items-center">
        <div className="border-4 border-pink-700 w-full  flex justify-center items-center">
          <div className="border-2 border-black flex-1 flex justify-center items-center">
            <div className="border border-yellow-700 w-1/2 text-center">
              {data.p1ready ? 'Ready' : 'Not Ready'}
            </div>
          </div>
          <div className="border-2 border-black flex-1 flex justify-center items-center">
            <div className="border border-yellow-700 w-1/2 text-center">
              {data.p2ready ? 'Ready' : 'Not Ready'}
            </div>
          </div>
        </div>
        <div className="border-4 border-pink-700 h-[10%]"></div>
        <div className="border-4 border-pink-700 flex justify-center items-center">
          <button onClick={handleReadyClick}>Ready</button>
        </div>
      </div>
    );
  }

  if (type === 'timer' && data.timerval !== undefined) {
    return (
      <div className="absolute border-4 border-pink-700 w-full  flex justify-center items-center">
        <div className="border-2 border-black flex-1 flex justify-center items-center">
          {data.timerval > 0 ? data.timerval : 'GO'}
        </div>
      </div>
    );
  }

  return null;
}

export default GameOverlay;
