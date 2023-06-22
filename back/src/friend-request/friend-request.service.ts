import { ForbiddenException, Injectable } from '@nestjs/common';
import { FRStatus, FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFriendRequestDto } from './dto';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async createFR(fromId: number, toId: number): Promise<FriendRequest> {
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        fromId,
        toId,
      },
    });
    return friendRequest;
  }

  async getMyFriends(userId: number) {
    const acceptedRequests: FriendRequest[] =
      await this.prisma.friendRequest.findMany({
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
            equals: FRStatus.ACCEPTED,
          },
        },
      });

    const friendIds = acceptedRequests.map(
      ({ fromId, toId }: { fromId: number; toId: number }) => {
        if (fromId === userId) {
          return toId;
        } else {
          return fromId;
        }
      },
    );

    return this.prisma.user.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
      select: {
        id: true,
        name: true,
        level: true,
        avatar: true,
      },
    });
  }

  getFRs(fromId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        fromId,
      },
    });
  }

  getFRById(fromId: number, friendRequestId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        id: friendRequestId,
        fromId,
      },
    });
  }

  getFRByToId(userId1: number, userId2: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            fromId: userId1,
            toId: userId2,
          },
          {
            fromId: userId2,
            toId: userId1,
          },
        ],
      },
    });
  }

  async editFRById(
    userId: number,
    friendRequestId: number,
    dto: EditFriendRequestDto,
  ): Promise<FriendRequest> {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    });

    // Check ownership
    if (
      !friendRequest ||
      (friendRequest.fromId != userId && friendRequest.toId !== userId)
    )
      throw new ForbiddenException('Access to ressource denied');

    return this.prisma.friendRequest.update({
      where: {
        id: friendRequestId,
      },
      data: {
        ...dto,
      },
    });
  }

  // async editFRByToId(fromId: number, toId: number, dto: EditFriendRequestDto) {
  //   const friendRequest = await this.prisma.friendRequest.findUnique({
  //     where: {
  //       fromId_toId: {
  //         fromId,
  //         toId,
  //       },
  //     },
  //   });

    // Check ownership
  //   if (!friendRequest)
  //     throw new ForbiddenException('Access to ressource denied');

  //   return this.prisma.friendRequest.update({
  //     where: {
  //       fromId_toId: {
  //         fromId,
  //         toId,
  //       },
  //     },
  //     data: {
  //       ...dto,
  //     },
  //   });
  // }

  async deleteFRById(fromId: number, friendRequestId: number) {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    });

    // Check ownership
    if (!friendRequest || friendRequest.fromId != fromId)
      throw new ForbiddenException('Access to ressource denied');

    this.prisma.friendRequest.delete({
      where: {
        id: friendRequestId,
      },
    });
  }

  async deleteFRByToId(fromId: number, toId: number) {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        fromId_toId: {
          fromId,
          toId,
        },
      },
    });

    // Check ownership
    if (!friendRequest)
      throw new ForbiddenException('Access to ressource denied');

    this.prisma.friendRequest.delete({
      where: {
        fromId_toId: {
          fromId,
          toId,
        },
      },
    });
  }
}
