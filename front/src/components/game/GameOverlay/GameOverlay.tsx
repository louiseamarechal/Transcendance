import GameOverlayPlaying from "./GameOverlayPlaying";
import GameOverlayReady from "./GameOverlayReady";
import GameOverlayTimer from "./GameOverlayTimer";

export type OverlayData = {
  p1name?: string;
  p2name?: string;
  p1ready?: boolean;
  p2ready?: boolean;
  timerval?: number;
  score?: [number, number];
};

type GameOverlayProps = {
  type: string;
  data: OverlayData;
};

export default function GameOverlay({ type, data }: GameOverlayProps) {
  if (type === 'ready') {
    return <GameOverlayReady data={data} />;
  }

  if (type === 'timer') {
    return <GameOverlayTimer data={data} />;
  }

  if (type === 'playing') {
    return <GameOverlayPlaying data={data} />;
  }

  return null;
}