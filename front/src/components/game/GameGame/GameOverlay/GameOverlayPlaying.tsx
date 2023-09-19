import { OverlayData } from '../../../../../../shared/server/ServerPayloads';

type GameOverlayPlayingProps = {
  data: OverlayData;
};

export default function GameOverlayPlaying({ data }: GameOverlayPlayingProps) {
  if (data.p1name && data.p2name && data.score) {
    return (
      <div className="absolute w-full h-full flex justify-center items-start">
        <div className="text-4xl w-full flex-row-center text-center">
          <div className="w-[40%] overflow-hidden">{`${data.p1name}`}</div>
          <div className="w-[10%] overflow-hidden">{`${data.score[0]}`}</div>
          <div className="w-[10%] overflow-hidden">{`${data.score[1]}`}</div>
          <div className="w-[40%] overflow-hidden">{`${data.p2name}`}</div>
        </div>
      </div>
    );
  }

  return null;
}
