import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId } from 'src/common/decorators';
import { EditUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get('me')
  getMe(@GetUser('sub') userId: number) {
    console.log('GET /user/me called');
    return this.userService.getMe(userId);
  }

  @Patch('me')
  editUser(@GetUserId() userId: number, @Body() dto: EditUserDto) {
    console.log('PATCH /user/me called');
    return this.userService.editUser(userId, dto);
  }
}
