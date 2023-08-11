import { OverlayData } from '../../../../../shared/server/ServerPayloads';

type GameOverlayPlayingProps = {
  data: OverlayData;
};

export default function GameOverlayPlaying({ data }: GameOverlayPlayingProps) {
  if (data.p1name && data.p2name && data.score) {
    return (
      <div className="absolute border-4 border-pink-700 w-full h-full flex justify-center items-start">
        <div className="text-4xl border-2 border-black flex-1 flex justify-center">
          <div className="border-2 border-green-500 flex-1 text-center">{`${data.p1name}`}</div>
          <div className="border-2 border-green-500 w-[10%] text-center">{`${data.score[0]}`}</div>
          <div className="border-2 border-green-500 w-[10%] text-center">{`${data.score[1]}`}</div>
          <div className="border-2 border-green-500 flex-1 text-center">{`${data.p2name}`}</div>
        </div>
      </div>
    );
  }

  return null;
}
