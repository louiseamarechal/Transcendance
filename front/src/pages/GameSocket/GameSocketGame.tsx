import { PointerEvent, useRef, useState } from 'react';

export default function GameSocketLobby() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // setPos({ x: event.clientX, y: event.clientY });
    const divMinY = divRef.current!.offsetTop;
    const divMaxY = divMinY + divRef.current!.offsetHeight;

    const newObj = { x: event.clientX, y: event.clientY};

    if (event.clientY <= divMinY) {
      newObj.y = 0;
    } else if (event.clientY >= divMaxY) {
      newObj.y = 1;
    } else {
      newObj.y = (event.clientY - divMinY) / (divMaxY - divMinY)
    }

    setPos(newObj)

    console.log(divRef.current?.offsetLeft);
    // gameSocket.emit('game-input', { x: event.clientX, y: event.clientY });
  };

  return (
    <div
      className="h-screen grid place-content-center"
      onPointerMove={handlePointerMove}
    >
      <div>
        Pos X: {pos.x}
        <br />
        Pos Y: {pos.y}
      </div>
      <div ref={divRef} className="h-[20em] w-[20em] bg-indigo-300"></div>
    </div>

    // <button
    //   onClick={() => console.log(gameSocket.emit('game-input', 'Bonsoir'))}
    // >
    //   HERRRE
    // </button>
  );
}
