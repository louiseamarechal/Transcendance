import { io } from 'socket.io-client';

export const notifSocket = io('http://localhost:3000/notif', {
  autoConnect: false,
});

export const gameSocket = io('http://localhost:3000/game', {
  autoConnect: false,
});

export const channelSocket = io('http://localhost:3000/channel', {
  autoConnect: false,
});
