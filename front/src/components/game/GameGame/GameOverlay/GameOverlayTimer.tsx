import { OverlayData } from '../../../../../../shared/server/ServerPayloads';

type GameOverlayTimerProps = {
  data: OverlayData;
};

export default function GameOverlayTimer({ data }: GameOverlayTimerProps) {
  if (data.timerval !== undefined) {
    return (
      <div className="absolute border-4 border-pink-700 w-full  flex justify-center items-center">
        <div className="text-7xl border-2 border-black flex-1 flex justify-center items-center">
          {data.timerval > 0 ? data.timerval : 'GO'}
        </div>
      </div>
    );
  }

  return null;
}
