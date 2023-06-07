import { Controller, Get } from "@nestjs/common";

@Controller('/')
export class AppController {

  @Get('test_auth')
  test_auth() {
    return 'if you see this, it must mean you provided a valid jwt'
  }
}