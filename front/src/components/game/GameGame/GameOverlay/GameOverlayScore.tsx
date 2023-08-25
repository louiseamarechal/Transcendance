import { useNavigate } from 'react-router-dom';
import { OverlayData } from '../../../../../../shared/server/ServerPayloads';

type GameOverlayReadyProps = {
  data: OverlayData;
};

export default function GameOverlayScore({ data }: GameOverlayReadyProps) {
  const navigate = useNavigate();

  if (data.p1name && data.p2name && data.score) {
    return (
      <div className="absolute border-4 border-fuchsia-300 w-full h-full flex flex-col justify-center items-center">
        <div className="border-4 border-pink-700 w-full flex justify-center items-center">
          <div className="text-7xl">Final Score</div>
        </div>
        <div className="h-[10%]"></div>
        <div className="text-4xl border-2 w-full border-black flex justify-center">
          <div className="border-2 border-green-500 flex-1 text-center">{`${data.p1name}`}</div>
          <div className="border-2 border-green-500 w-[10%] text-center">{`${data.score[0]}`}</div>
          <div className="border-2 border-green-500 w-[10%] text-center">{`${data.score[1]}`}</div>
          <div className="border-2 border-green-500 flex-1 text-center">{`${data.p2name}`}</div>
        </div>
        <div className="h-[10%]"></div>
        <div className="border-4 border-pink-700 w-full flex justify-center items-center">
          <div className="text-3xl" onClick={() => navigate('/game')}>
            Return to home
          </div>
        </div>
      </div>
    );
  }

  return null;
}
