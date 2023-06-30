import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotifService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  notifService: NotifService;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  // handle connection
  handleConnection(client: any) {
    this.notifService.setSocket(this.server);
    console.log(`client with id: ${client.id} is connected !`);
  }

  // handle disconnect
  handleDisconnect(client: any) {
    this.notifService.setSocket(null);
    console.log(`client with id: ${client.id} has left the connection !`);
  }

  @SubscribeMessage('incrementGame')
  handleIncrementGame(): void {
    const currentGame = this.notifService.getGame();
    const updatedGame = currentGame + 1;

    // Mettez à jour la valeur de game dans le notifService
    this.notifService.setGame(updatedGame);

    // Diffusez la valeur de game mise à jour aux clients connectés
    this.server.emit('gameUpdated', updatedGame);
  }

  // testNotif() {
  //   this.server.emit('notif', '1');
  //   // console.log(this.server);
  // }
}

// https://docs.nestjs.com/websockets/gateways
// https://socket.io/docs/v4/server-initialization/
