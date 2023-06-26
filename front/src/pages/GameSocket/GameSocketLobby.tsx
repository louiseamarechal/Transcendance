import React from 'react';
import { gameSocket } from '../../api/socket';

export default function GameSocketLobby() {
  return (
    <button
      onClick={() => console.log(gameSocket.emit('game-input', 'Bonsoir'))}
    >
      HERRRE
    </button>
  );
}
