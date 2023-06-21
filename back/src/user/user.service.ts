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

  async getAll(): Promise<
    {
      id: number | null;
      name: string | null;
      avatar: string | null;
      level: number | null;
    }[]
  > {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
      },
    });
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
