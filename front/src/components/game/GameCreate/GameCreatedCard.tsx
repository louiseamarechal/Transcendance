import { GameRequest } from '../../../../../shared/common/types/game.type';
import NiceButton from '../../ui/NiceButton';

type GameCreatedCardProps = {
  gr: GameRequest;
  onDestroy: (gr: GameRequest) => void;
};

function GameCreatedCard({ gr, onDestroy }: GameCreatedCardProps) {
  return (
    <div className="w-40 h-40 flex-col-center border border-[#0000001C] shadow-lg ">
      {`Game versus ${gr.p2.name}`}
      <NiceButton onClick={() => onDestroy(gr)}>Destroy</NiceButton>
    </div>
  );
}

export default GameCreatedCard;
