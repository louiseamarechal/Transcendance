import { OverlayData } from '../../../../../../shared/server/ServerPayloads';

type GameOverlayTimerProps = {
  data: OverlayData;
};

export default function GameOverlayTimer({ data }: GameOverlayTimerProps) {
  if (data.timerval !== undefined) {
    return (
      <div className="absolute w-full flex-row-center">
        <div className="text-7xl">
          {data.timerval > 0 ? data.timerval : 'GO'}
        </div>
      </div>
    );
  }

  return null;
}
