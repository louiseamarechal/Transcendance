import { io } from 'socket.io-client';
import BACK_URL from './backUrl';

export const notifSocket = io(`${BACK_URL}/notif`, {
  autoConnect: false,
});

export const gameSocket = io(`${BACK_URL}/game`, {
  autoConnect: false,
});

export const channelSocket = io(`${BACK_URL}/channel`, {
  autoConnect: false,
});
