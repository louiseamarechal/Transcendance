import GameOverlayPlaying from './GameOverlayPlaying';
import GameOverlayReady from './GameOverlayReady';
import GameOverlayTimer from './GameOverlayTimer';
import {
  OverlayType,
  OverlayData,
} from '../../../../../../shared/server/ServerPayloads';
import GameOverlayScore from './GameOverlayScore';

type GameOverlayProps = {
  type: OverlayType;
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

  if (type === 'score') {
    return <GameOverlayScore data={data} />;
  }

  return null;
}
