import { useNavigate } from 'react-router-dom';
import { OverlayData } from '../../../../../../shared/server/ServerPayloads';
import NiceButton from '../../../ui/NiceButton';

type GameOverlayReadyProps = {
  data: OverlayData;
};

export default function GameOverlayScore({ data }: GameOverlayReadyProps) {
  const navigate = useNavigate();

  if (data.p1name && data.p2name && data.score) {
    return (
      <div className="absolute w-full h-full flex-col-center">
        <div className="text-7xl">Final Score</div>
        <div className="h-[10%]"></div>
        <div className="text-4xl w-full flex-row-center text-center">
          <div className="w-[40%] overflow-hidden">{`${data.p1name}`}</div>
          <div className="w-[10%] overflow-hidden">{`${data.score[0]}`}</div>
          <div className="w-[10%] overflow-hidden">{`${data.score[1]}`}</div>
          <div className="w-[40%] overflow-hidden">{`${data.p2name}`}</div>
        </div>
        <div className="h-[10%]"></div>
        <div className="text-3xl flex-row-center">
          <NiceButton onClick={() => navigate('/game')}>
            Return to home
          </NiceButton>
        </div>
      </div>
    );
  }

  return null;
}
