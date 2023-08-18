import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { NoParamCallback, createReadStream, existsSync, rename, rm } from 'fs';
import { PublicUser } from './types';
import { FRStatus, FriendRequest } from '@prisma/client';
import { join } from 'path';
import { Response } from 'express';
// import BACK_URL from '../../../front/src/api/backUrl'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: number): Promise<PublicUser> {
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
        s2fa: true,
      },
    });

    if (!user) {
      throw new BadRequestException(`User #${userId} not found`);
    }
    return user;
  }
 
  async getAvatarById(userId: number, res: Response) {
    const user: PublicUser = await this.getUserById(userId);
    const avatar = user.avatar;

    if (!avatar) {
      throw new Error('No avatar in getAvatar');
    }

    const file = createReadStream(join(process.cwd(), 'assets', avatar));
    file.pipe(res);
  }

  async getAvatarByFile(file: string, res: Response) {
    if (existsSync(join(process.cwd(), 'assets', file))) {
      const stream = createReadStream(join(process.cwd(), 'assets', file));
      stream.pipe(res);
    }
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

  async editUser(userId: number, dto: EditUserDto): Promise<PublicUser> {
    const user = await this.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException('Name already exists');
        }
        throw error;
      });
    return user;
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userLogin: string,
    userId: number,
  ) {
    const oldname: string = file.path;
    const newname: string = `assets/${userLogin}.jpg`;
    console.log(file);
    console.log(oldname);
    console.log(newname);

    const cb: NoParamCallback = (err) => {
      if (err) throw err;
      console.log('Successfully renamed - AKA moved!');
    };

    try {
      rename(oldname, newname, cb);
    } catch (err) {
      console.log(err);
      new InternalServerErrorException('Rename failed in uploadAvatar');
    }

    this.editUser(userId, { avatar: `${userLogin}.jpg` });
    return `${userLogin}.jpg`;
  }

  async getPendingFR(userId: number) {
    const pendingFR: FriendRequest[] = await this.prisma.friendRequest.findMany(
      {
        where: {
          OR: [
            {
              fromId: {
                equals: userId,
              },
            },
            {
              toId: {
                equals: userId,
              },
            },
          ],
          status: {
            equals: FRStatus.PENDING,
          },
        },
      },
    );

    const pendingFriendIds = pendingFR.map(
      ({ fromId, toId }: { fromId: number; toId: number }) => {
        if (fromId === userId) {
          return toId;
        } else {
          return fromId;
        }
      },
    );

    console.log('getting Pending Friend Request');

    return this.prisma.user.findMany({
      where: {
        id: {
          in: pendingFriendIds,
        },
      },
      select: {
        id: true,
        name: true,
        level: true,
        avatar: true,
      },
    });

    // console.log(pendingFR?.receivedRequests);
    // return pendingFR?.receivedRequests;
  }
}
