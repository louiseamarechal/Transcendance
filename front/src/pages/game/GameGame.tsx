import { PointerEvent, useEffect, useRef, useState } from 'react';
import { gameSocket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useParams } from 'react-router-dom';
import GameOverlay, {
  OverlayData,
} from '../../components/game/GameOverlay/GameOverlay';
import GameCanvas from '../../components/game/GameCanvas';
import GameBackground from '../../components/game/GameBackground';

export default function GameLobby() {
  const { gameId } = useParams();

  const divRef = useRef<HTMLDivElement>(null);

  const [overlayType, setOverlayType] = useState<string>('ready');
  const [overlayData, setOverlayData] = useState<OverlayData>({});
  const [gameData, setGameData] = useState<any>({});

  useEffect(() => {
    function updateOverlay(payload: { type: any; data: OverlayData }) {
      console.log('In updateOverlay', { payload });
      setOverlayType(payload.type);
      setOverlayData(payload.data);
    }

    function gameData(payload: { data: any }) {
      console.log('In gameData', { payload });
      setGameData(payload.data);
    }

    gameSocket.on('server.game.updateOverlay', updateOverlay);
    gameSocket.on('server.game.gameData', gameData);

    return () => {
      gameSocket.off('server.game.updateOverlay', updateOverlay);
      gameSocket.off('server.game.gameData', gameData);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const divElem = divRef.current;

    if (!gameId || !divElem) return;

    const divMinY = divElem.offsetTop;
    const divMaxY = divMinY + divElem.offsetHeight;

    let input;
    if (event.clientY <= divMinY) {
      input = 0;
    } else if (event.clientY >= divMaxY) {
      input = 1;
    } else {
      input = (event.clientY - divMinY) / (divMaxY - divMinY);
    }

    const payload: ClientPayloads[ClientEvents.GameInput] = {
      gameId: gameId,
      val: input,
    };
    gameSocket.emit(ClientEvents.GameInput, payload);
  }

  return (
    <div
      className="border-8 border-red-700 h-full flex flex-col justify-center items-center"
      onPointerMove={handlePointerMove}
    >
      <div
        ref={divRef}
        className="relative h-4/5 w-4/5 border-8 border-blue-600 flex flex-col justify-center items-center"
      >
        <GameBackground />
        <GameCanvas data={gameData} />
        <GameOverlay type={overlayType} data={overlayData} />
      </div>
    </div>
  );
}
