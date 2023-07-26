import { io } from 'socket.io-client';

export const gameSocket = io('http://localhost:3000/game', {
  autoConnect: false,
});
