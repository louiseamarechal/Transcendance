import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { NoParamCallback, createReadStream, existsSync, rename, rm } from 'fs';
import { BlockedUser, FRStatus, FriendRequest } from '@prisma/client';
import { join } from 'path';
import { Response } from 'express';
import {
  PublicUser,
  PublicUserSelect,
} from '../../../shared/common/types/user.type';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: number): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: PublicUserSelect,
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

  async getAll(userId: number): Promise<PublicUser[]> {
    return await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: PublicUserSelect,
    });
  }

  async editUser(userId: number, dto: EditUserDto): Promise<PublicUser> {
    const user = await this.prisma.user
      .update({
        where: { id: userId },
        data: { ...dto },
        select: PublicUserSelect,
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
  ): Promise<string> {
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

  async createBlockedUser(userId: number, blockedId: number) {
    const dupId: { id: number } | null =
      await this.prisma.blockedUser.findUnique({
        where: {
          blockedId_blockedById: {
            blockedId,
            blockedById: userId,
          },
        },
        select: {
          id: true,
        },
      });
    console.log({ dupId });
    if (dupId) throw new ConflictException('User already blocked !');
    const alreadyBlocked: { id: number } | null =
      await this.prisma.blockedUser.findUnique({
        where: {
          blockedId_blockedById: {
            blockedId: userId,
            blockedById: blockedId,
          },
        },
        select: {
          id: true,
        },
      });
    console.log({ alreadyBlocked });
    if (alreadyBlocked)
      throw new ConflictException('User already blocked you !');
    const FR: { id: number }[] = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            fromId: userId,
            toId: blockedId,
          },
          {
            fromId: blockedId,
            toId: userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    console.log({ FR });
    if (FR.length !== 1) throw new ConflictException('User not a friend !');
    const updatedFR = await this.prisma.friendRequest.update({
      where: {
        id: FR[0].id,
      },
      data: {
        status: FRStatus.REFUSED,
      },
    });
    console.log({ updatedFR });
    const blocked = await this.prisma.blockedUser.create({
      data: {
        blockedId,
        blockedById: userId,
      },
    });
    console.log({ blocked });
  }

  async getBlockedUser(userId: number): Promise<number[]> {
    const blockedUsers = await this.prisma.blockedUser.findMany({
      where: {
        blockedById: userId,
      },
      select: {
        blockedId: true,
      },
    });
    return blockedUsers.map((l: { blockedId: number }) => l.blockedId);
  }

  async getBlockedByUser(
    userId: number,
    blockerId: number,
  ): Promise<BlockedUser | null> {
    return this.prisma.blockedUser.findUnique({
      where: {
        blockedId_blockedById: {
          blockedId: userId,
          blockedById: blockerId,
        },
      },
    });
  }

  async deleteBlockedUser(userId: number, blockedId: number) {
    const toDeleteId: { id: number } | null =
      await this.prisma.blockedUser.findUnique({
        where: {
          blockedId_blockedById: {
            blockedId,
            blockedById: userId,
          },
        },
        select: {
          id: true,
        },
      });
    if (!toDeleteId) throw new ConflictException('User not blocked !');
    const FR: { id: number }[] = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            fromId: userId,
            toId: blockedId,
          },
          {
            fromId: blockedId,
            toId: userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    if (FR.length !== 1) throw new ConflictException('User not a friend !');
    await this.prisma.friendRequest.update({
      where: {
        id: FR[0].id,
      },
      data: {
        status: FRStatus.ACCEPTED,
      },
    });
    return this.prisma.blockedUser.delete({
      where: {
        id: toDeleteId.id,
      },
    });
  }
}
