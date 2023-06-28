import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { NotifGateway } from './notif.gateway';

@Controller('notif')
export class NotifController {
  constructor(private notifGateway: NotifGateway) {}
  @Get('test')
  @Public() // pas besoin de token
  testNotif() {
    this.notifGateway.testNotif();
  }
}
