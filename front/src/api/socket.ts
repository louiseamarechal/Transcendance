import { io } from 'socket.io-client';

const GameURL = 'http://localhost:3000/game';
const AppURL = 'http://localhost:3000';

export const gameSocket = io(GameURL, {
  autoConnect: false,
});

export const notifSocket = io(AppURL, { autoConnect: false });
