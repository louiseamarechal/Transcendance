import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocketService {
  getLoginFromClient(client: Socket) {
    console.log({ clientHandshake: client.handshake.auth });
    // console.log({ client: client });

    const { token } = client.handshake.auth;
    if (!token) {
      throw new WsException('No authorization');
    }

    const secret: string = process.env.JWT_ACCESS_SECRET
      ? process.env.JWT_ACCESS_SECRET
      : '';
    const payload = verify(token, secret);
    if (typeof payload === 'object') {
      return payload.login;
    }
    return payload;
  }

  handleJoinRoom(client: Socket, name: string) {
    const userLogin = this.getLoginFromClient(client);
    const room = userLogin + name;
    client.join(room);
    const rooms = Object.keys(client.rooms);
    console.log(rooms);
    client.to(room).emit('welcome');
  }

  handleConnection(client: Socket, extension: string) {
    console.log(`client with id ${client.id} is now connected`);
    const room = this.getLoginFromClient(client) + extension;
    client.join(room);
    // const rooms = Object.keys(client.rooms);
    if (client.rooms.has(room)) {
      console.log('Success, you just joined the room !', room);
      console.log(client.rooms.size);
      client.rooms.forEach((key) => {
        console.log(key);
      });
    }
  }
}
