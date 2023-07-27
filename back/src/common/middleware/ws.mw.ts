import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { Socket } from 'socket.io';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void): any;
}

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      WsJwtGuard.validateToken(client);
      next();
    } catch (err) {
      next(err);
    }
  };
};
