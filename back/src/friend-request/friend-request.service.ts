import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FRStatus, FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFriendRequestDto } from './dto';
import { NotifGateway } from 'src/sockets/notif/notif.gateway';

@Injectable()
export class FriendRequestService {
  constructor(
    private notifGateway: NotifGateway,
    private prisma: PrismaService,
  ) {}
  async createFR(fromId: number, toId: number): Promise<FriendRequest> {
    const friendRequest = await this.prisma.friendRequest
      .create({
        data: {
          fromId,
          toId,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002')
          throw new ConflictException('Friend Request already exists.');
        throw error;
      });

    const receiver = await this.prisma.user.findUnique({
      where: { id: toId },
    });
    if (receiver === null) {
      throw new ConflictException();
    }
    this.notifGateway.handleFriendsNotif(receiver.login);
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

  getFRs(fromId: number): Promise<FriendRequest[]> {
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

  getFRByToId(fromId: number, toId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        fromId,
        toId,
      },
    });
  }

  getReceivedFR(
    toId: number,
  ): Promise<{ fromId: number; toId: number; status: FRStatus }[]> {
    return this.prisma.friendRequest.findMany({
      where: {
        toId,
        status: FRStatus.PENDING,
      },
      select: {
        fromId: true,
        toId: true,
        status: true,
      },
    });
  }

  async editFRById(
    fromId: number,
    friendRequestId: number,
    dto: EditFriendRequestDto,
  ) {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    });

    // Check ownership
    if (!friendRequest || friendRequest.fromId != fromId)
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

  async editFRByToId(fromId: number, toId: number, dto: EditFriendRequestDto) {
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

    return this.prisma.friendRequest.update({
      where: {
        fromId_toId: {
          fromId,
          toId,
        },
      },
      data: {
        ...dto,
      },
    });
  }

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
