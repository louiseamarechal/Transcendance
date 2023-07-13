import { PointerEvent, useEffect, useRef, useState } from 'react';
import { socket } from '../../api/socket';
import { ClientEvents } from '../../../../shared/client/ClientEvents';
import { ClientPayloads } from '../../../../shared/client/ClientPayloads';
import { useParams } from 'react-router-dom';

export default function GameSocketLobby() {
  const [pos, setPos] = useState({ x: 0, y: 0 }); // debug
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameId } = useParams();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const divMinY = canvasRef.current!.offsetTop;
    const divMaxY = divMinY + canvasRef.current!.offsetHeight;

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
      className="border-4 border-red-700 h-full flex flex-col justify-center items-center"
      onPointerMove={handlePointerMove}
    >
      <div className="fixed">
        Pos X: {pos.x}
        <br />
        Pos Y: {pos.y}
      </div>
      <div className="h-4/5 w-4/5 border-4 border-blue-600">
        <canvas ref={canvasRef} className="h-full w-full" id="canvas" />
      </div>
    </div>
  );
}
