import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotifService {
  private socket: Server;
  private game: number;
  private friend: number;
  private chat: number;

  public setSocket(socket: Server): void {
    this.socket = socket;
  }

  public getSocket(): Server {
    return this.socket;
  }

  public setGame(game: number): void {
    this.game = game;
  }

  public getGame(): number {
    return this.game;
  }

  public setFriend(friend: number): void {
    this.friend = friend;
  }

  public getFriend(): number {
    return this.friend;
  }

  public setChat(chat: number): void {
    this.chat = chat;
  }

  public getChat(): number {
    return this.chat;
  }
}
