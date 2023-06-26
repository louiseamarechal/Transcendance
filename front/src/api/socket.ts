import { io } from 'socket.io-client';

const GameURL = 'http://localhost:3000/game';

export const gameSocket = io(GameURL, {
  autoConnect: false,
});
