import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        login: true,
        name: true,
        level: true,
        avatar: true,
        statTotalGame: true,
        statTotalWin: true,
      },
    });

    if (!user) {
      throw new Error(`User #${userId} not found`);
    }
    return user;
  }

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    return user;
  }
}
