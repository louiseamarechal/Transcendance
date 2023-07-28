import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

export class WsJwtGuard implements CanActivate {
  constructor(@Inject('ConfigService') private config: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);

    return true;
  }

  static validateToken(client: Socket) {
    console.log('In validateToken');
    const { token } = client.handshake.auth;
    if (!token) {
      throw new WsException('No authorization');
    }

    const secret: string = process.env.JWT_ACCESS_SECRET
      ? process.env.JWT_ACCESS_SECRET
      : '';
    const payload = verify(token, secret);

    if (typeof payload === 'string') {
      throw new WsException('JwtPayload is not an object');
    }
    console.log({ payload });
    return payload;
  }
}
