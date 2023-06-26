import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const GameURL =
  process.env.NODE_ENV === 'production'
    ? undefined
    : 'http://localhost:3000/game';

export const gameSocket = io(GameURL, {
  autoConnect: false,
});
