import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AtJwt } from 'src/auth/types';
import { PublicUser } from 'src/user/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketService {
  constructor(private jwtService: JwtService, private userService: UserService) {};

  async verifyToken(client: Socket): Promise<AtJwt> {
    return this.jwtService.verify(client.handshake.auth.token);
  }

  async attachUserDataToClient(client: Socket, token: AtJwt) {
      const user: PublicUser = await this.userService.getUserById(token.id);
      client.data.user = user;
  }
}
