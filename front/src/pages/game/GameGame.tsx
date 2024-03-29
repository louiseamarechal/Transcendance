import { PointerEvent, useEffect, useRef, useState } from 'react';
import { gameSocket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GameCanvas from '../../components/game/GameGame/GameCanvas';
import GameBackground from '../../components/game/GameGame/GameBackground';
import {
  GameData,
  OverlayData,
  ServerPayloads,
} from '../../../../shared/server/ServerPayloads';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import GameOverlay from '../../components/game/GameGame/GameOverlay/GameOverlay';

export default function GameLobby() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const divRef = useRef<HTMLDivElement>(null);

  const [overlayType, setOverlayType] = useState<string>('ready');
  const [overlayData, setOverlayData] = useState<OverlayData>({});
  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    function updateOverlay(
      payload: ServerPayloads[ServerEvents.updateOverlay],
    ) {
      // console.log('In updateOverlay', { payload });
      setOverlayType(payload.type);
      setOverlayData(payload.data);
    }

    function gameData(payload: ServerPayloads[ServerEvents.gameData]) {
      console.log('In gameData', { payload });
      setGameData(payload);
    }

    function gameAbort() {
      navigate('/game');
      alert('Game Aborted');
    }

    gameSocket.on(ServerEvents.updateOverlay, updateOverlay);
    gameSocket.on(ServerEvents.gameData, gameData);
    gameSocket.on(ServerEvents.gameAbort, gameAbort);

    return () => {
      gameSocket.off(ServerEvents.updateOverlay, updateOverlay);
      gameSocket.off(ServerEvents.gameData, gameData);
      gameSocket.off(ServerEvents.gameAbort, gameAbort);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log({ location });
      gameSocket.emit(ClientEvents.GamePing);
    }, 1000);

    return () => {
      clearInterval(intervalId);
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
    <div className="h-full flex-col-center" onPointerMove={handlePointerMove}>
      <div
        ref={divRef}
        className="relative h-4/5 w-4/5 border-8 border-black border-dashed flex-col-center"
      >
        <GameBackground />
        {gameData ? <GameCanvas {...gameData} /> : null}
        <GameOverlay type={overlayType} data={overlayData} />
      </div>
    </div>
  );
}
