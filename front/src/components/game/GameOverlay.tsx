import { useParams } from 'react-router-dom';
import { socket } from '../../api/socket';

export type OverlayData = {
  p1ready?: boolean;
  p2ready?: boolean;
};

type GameOverlayProps = {
  type: string;
  data: OverlayData;
  //   dataReady?: {
  //     p1: boolean;
  //     p2: boolean;
  //   };
  //   dataTimer?: any;
  //   dataScore?: any;
  //   dataResult?: any;
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
      <div className="absolute border-4 border-pink-700 w-full h-full flex justify-center items-center">
        <div className="border-2 border-black flex-1 flex justify-center items-center">
          <button
            onClick={handleReadyClick}
            className="border border-yellow-700 w-1/2"
          >
            {data.p1ready ? 'Ready' : 'Not Ready'}
          </button>
        </div>
        <div className="border-2 border-black flex-1 flex justify-center items-center">
          <button
            onClick={handleReadyClick}
            className="border border-yellow-700 w-1/2"
          >
            {data.p2ready ? 'Ready' : 'Not Ready'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default GameOverlay;
