import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId } from 'src/common/decorators';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get('me')
  async getUser(@GetUser('sub') userId: number) {
    console.log('user/me a ete appele');
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  @Patch('me')
  editUser(@GetUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
