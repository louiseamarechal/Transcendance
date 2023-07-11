import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';
import { NoParamCallback, rename, rm } from 'fs';
import { PublicUser } from './types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number) {
    const user: PublicUser | null = await this.prisma.user.findUnique({
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
      throw new BadRequestException(`User #${userId} not found`);
    }
    return user;
  }

  async getAll(userId: number): Promise<
    {
      id: number | null;
      name: string | null;
      avatar: string | null;
      level: number | null;
    }[]
  > {
    return await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
      },
    });
  }

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name already exists');
      }
      throw new ConflictException('Unknown reason');
    }
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
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
      throw new BadRequestException(`User #${id} not found`);
    }
    return user;
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userLogin: string,
    userId: number,
  ) {
    const oldname: string = file.path;
    const newname: string = `public/${userLogin}${file.filename}`;
    const cb: NoParamCallback = (err) => {
      if (err) throw err;
      console.log('Successfully renamed - AKA moved!');
    };

    const oldAvatar = (await this.getMe(userId)).avatar?.replace(
      'http://localhost:3000/',
      '',
    );
    console.log({ oldAvatar });

    try {
      rename(oldname, newname, cb);
      if (oldAvatar) rm(oldAvatar, () => {});
    } catch (err) {
      console.log(err);
      new InternalServerErrorException('Rename failed in uploadAvatar');
    }

    this.editUser(userId, { avatar: `http://localhost:3000/${newname}` });
    return `http://localhost:3000/${newname}`;
  }
}
