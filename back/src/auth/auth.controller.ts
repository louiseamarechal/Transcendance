import {
  Body,
  Headers,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser, GetUserId, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Headers('origin') origin: string,
  ): Promise<Tokens> {
    return await this.authService.login(dto, origin);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Post('checkcode')
  @HttpCode(HttpStatus.OK)
  checkcode(@GetUserId() userId: number, @Body('code') code: string) {
    return this.authService.checkcode(userId, code);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUserId() userId: number,
    @GetUser('refreshToken') rt: string,
  ) {
    return this.authService.refreshTokens(userId, rt);
  }
}
