import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller('/')
export class AppController {
  @Get('private-ping')
  private_ping() {
    return 'if you see this, it must mean you provided a valid jwt';
  }

  @Get('public-ping')
  @Public()
  public_ping() {
    return 'pong'
  }

}
