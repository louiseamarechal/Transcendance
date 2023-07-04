import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { Server } from 'socket.io';
// import { Server } from 'http';

@Injectable()
export class NotifService {
  constructor(private socketService: SocketService) {}

  handleFriendsNotif(roomName: string, server: Server) {
    console.log('sending FR on room', roomName);
    server.to(roomName).emit('friends-notif');
  }
}
