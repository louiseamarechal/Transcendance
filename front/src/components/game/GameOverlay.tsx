import { useParams } from 'react-router-dom';
import { gameSocket } from '../../api/socket';

export type OverlayData = {
  p1name?: string,
  p2name?: string,
  p1ready?: boolean;
  p2ready?: boolean;
  timerval?: number;
  score?: [number, number]
};

type GameOverlayProps = {
  type: string;
  data: OverlayData;
};

export default function GameOverlay({ type, data }: GameOverlayProps) {
  const { gameId } = useParams();

  function handleReadyClick() {
    const payload: any = {
      gameId: gameId,
    };
    gameSocket.emit('client.game.setReady', payload);
  }

  if (type === 'ready') {
    return (
      <div className="absolute border-4 border-fuchsia-300 w-full h-full flex flex-col justify-center items-center">
        <div className="border-4 border-pink-700 w-full  flex justify-center items-center">
          <div className="border-2 border-black flex-1 flex justify-center items-center">
            <div
              className={
                'border border-yellow-700 w-1/2 text-center ' +
                (data.p1ready ? 'bg-green-200' : 'bg-red-200')
              }
            >
              {data.p1ready ? 'Ready' : 'Not Ready'}
            </div>
          </div>
          <div className="border-2 border-black flex-1 flex justify-center items-center">
            <div
              className={
                'border border-yellow-700 w-1/2 text-center ' +
                (data.p2ready ? 'bg-green-200' : 'bg-red-200')
              }
            >
              {data.p2ready ? 'Ready' : 'Not Ready'}
            </div>
          </div>
        </div>
        <div className="border-4 border-pink-700 h-[10%]"></div>
        <div className="text-7xl border-4 border-pink-700 flex justify-center items-center">
          <button onClick={handleReadyClick}>Ready</button>
        </div>
      </div>
    );
  }

  if (type === 'timer' && data.timerval !== undefined) {
    return (
      <div className="absolute border-4 border-pink-700 w-full  flex justify-center items-center">
        <div className="text-7xl border-2 border-black flex-1 flex justify-center items-center">
          {data.timerval > 0 ? data.timerval : 'GO'}
        </div>
      </div>
    );
  }

  if (type === 'playing' && data.p1name && data.p2name && data.score) {
    return (
      <div className="absolute border-4 border-pink-700 w-full h-full flex justify-center items-start">
        <div className="text-7xl border-2 border-black flex-1 flex justify-center">
          <div className='border-2 border-green-500 flex-5 text-center'>{`${data.p1name}`}</div>
          <div className='border-2 border-green-500 flex-1 text-end'>{`${data.score[0]}`}</div>
          <div className='border-2 border-green-500 flex-1 text-start'>{`${data.score[1]}`}</div>
          <div className='border-2 border-green-500 flex-5 text-center'>{`${data.p2name}`}</div>
          {/* {`${data.p1name} ${data.score[0]}`} | {`${data.p2name} ${data.score[1]}`} */}

        </div>
      </div>
    );
  }

  return null;
}
