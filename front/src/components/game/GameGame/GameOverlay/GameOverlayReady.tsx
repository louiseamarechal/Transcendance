import { useParams } from 'react-router-dom';
import { gameSocket } from '../../../../api/socket';
import { OverlayData } from '../../../../../../shared/server/ServerPayloads';
import NiceButton from '../../../ui/NiceButton';

type GameOverlayReadyProps = {
  data: OverlayData;
};

export default function GameOverlayReady({ data }: GameOverlayReadyProps) {
  const { gameId } = useParams();

  const styleP1 = {
    backgroundColor: data.p1ready ? 'rgb(187, 247, 208)' : 'rgb(254, 202, 202)',
    width: '33%',
    padding: '8px',
    borderRadius: '8px',
  };

  const styleP2 = {
    backgroundColor: data.p2ready ? 'rgb(187, 247, 208)' : 'rgb(254, 202, 202)',
    width: '33%',
    padding: '8px',
    borderRadius: '8px',
  };

  function handleReadyClick() {
    const payload: any = {
      gameId: gameId,
    };
    gameSocket.emit('client.game.setReady', payload);
  }

  return (
    <div className="absolute w-full h-full flex-col-center text-center">
      <div className="w-full flex items-center justify-around">
        <div style={styleP1}>{data.p1ready ? 'Ready' : 'Not Ready'}</div>
        <div style={styleP2}>{data.p2ready ? 'Ready' : 'Not Ready'}</div>
      </div>
      <div className="h-[10%]"></div>
      <div className="text-4xl text-center">
        <NiceButton onClick={handleReadyClick}>Ready</NiceButton>
      </div>
    </div>
  );
}
