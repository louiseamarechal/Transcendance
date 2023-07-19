import { PointerEvent, useEffect, useRef, useState } from 'react';
import { socket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useParams } from 'react-router-dom';
import GameOverlay, { OverlayData } from '../../components/game/GameOverlay';
import GameCanvas from '../../components/game/GameCanvas';
import GameBackground from '../../components/game/GameBackground';

export default function GameSocketLobby() {
  const { gameId } = useParams();
  const [pos, setPos] = useState({ x: 0, y: 0 }); // debug

  // const [leftPlayer, setLeftPlayer] = useState<string>('');
  // const [rightPlayer, setRightPlayer] = useState<string>('');

  // const [leftPaddle, setLeftPaddle] = useState<number>(0);
  // const [rightPaddle, setRightPaddle] = useState<number>(0);
  // const [ball, setBall] = useState<[number, number]>([0, 0]);

  // const [score, setScore] = useState<[number, number]>([0, 0]);

  const divRef = useRef<HTMLDivElement>(null);

  const [overlayType, setOverlayType] = useState<string>('ready');
  const [overlayData, setOverlayData] = useState<OverlayData>({});

  useEffect(() => {
    function updateOverlay(payload: { type: any; data: any }) {
      console.log('In updateOverlay', { payload });
      setOverlayType(payload.type);
      setOverlayData(payload.data);
    }

    socket.on('server.game.updateOverlay', updateOverlay);

    return () => {
      socket.off('server.game.updateOverlay', updateOverlay);
    };
  }, []);

  // useEffect(() => {
  //   type Payload = {
  //     player1: string;
  //     player2: string;
  //     player1Pos: number;
  //     player2Pos: number;
  //     ballPos: [number, number];
  //     score: [number, number];
  //   };

  //   function handleUpdatePos(payload: Payload) {
  //     console.log(payload);
  //     setLeftPlayer(payload.player1);
  //     setRightPlayer(payload.player2);
  //     setLeftPaddle(payload.player1Pos);
  //     setRightPaddle(payload.player2Pos);
  //     setBall(payload.ballPos);
  //     setScore(payload.score);
  //   }

  //   socket.on('server.game.updatePos', handleUpdatePos);

  //   return () => {
  //     socket.off('server.game.updatePos', handleUpdatePos);
  //   };
  // }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const divMinY = divRef.current!.offsetTop;
    const divMaxY = divMinY + divRef.current!.offsetHeight;

    let input;
    if (event.clientY <= divMinY) {
      input = 0;
    } else if (event.clientY >= divMaxY) {
      input = 1;
    } else {
      input = (event.clientY - divMinY) / (divMaxY - divMinY);
    }

    setPos({ ...pos, y: input }); // debug

    const payload: ClientPayloads[ClientEvents.GameInput] = {
      gameId: gameId,
      val: input,
    };
    socket.emit(ClientEvents.GameInput, payload);
  };

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
        <GameCanvas />
        <GameOverlay type={overlayType} data={overlayData} />
      </div>
    </div>
  );
}
