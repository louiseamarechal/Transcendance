import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FRStatus, FriendRequest, VisType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFriendRequestDto } from './dto';
import { CreateChannelDto } from 'src/channel/dto';
import { ChannelService } from 'src/channel/channel.service';
import { NotifService } from 'src/notif/notif.service';

@Injectable()
export class FriendRequestService {
  constructor(
    private prisma: PrismaService,
    private channelService: ChannelService,
    private notifService: NotifService,
  ) {}
  async createFR(userId1: number, userId2: number): Promise<FriendRequest> {
    const FRs = await this.prisma.friendRequest.findMany({
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
    if (FRs.length > 0) {
      throw new ConflictException('Friend Request already exists.');
    }
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        fromId: userId1,
        toId: userId2,
      },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { id: userId2 },
    });
    if (receiver === null) {
      throw new ConflictException();
    }
    this.notifService.handleFriendsNotif(receiver.login);
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
    userId: number,
    friendRequestId: number,
    dto: EditFriendRequestDto,
  ) {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    });

    // Check ownership
    if (
      !friendRequest ||
      (friendRequest.fromId !== userId && friendRequest.toId !== userId)
    ) {
      throw new ForbiddenException('Access to ressource denied');
    }
    const updatedRequest = await this.prisma.friendRequest.update({
      where: {
        id: friendRequestId,
      },
      data: {
        ...dto,
      },
    });
    if (updatedRequest.status === FRStatus.ACCEPTED) {
      const dto: CreateChannelDto = {
        name: '',
        avatar: '',
        members: [updatedRequest.fromId, updatedRequest.toId],
        visibility: VisType.PRIVATE,
      };
      this.channelService.createChannel(userId, dto, 'FR');
    }
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

  async deleteFRById(userId: number, friendRequestId: number) {
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    });

    // Check ownership
    if (
      !friendRequest ||
      (friendRequest.fromId !== userId && friendRequest.toId !== userId)
    )
      throw new ForbiddenException('Access to ressource denied');

    const deletedUser = await this.prisma.friendRequest.delete({
      where: {
        id: friendRequestId,
      },
    });
    console.log(
      `delete user: ${deletedUser.id} : ${deletedUser.fromId} -> ${deletedUser.toId}`,
    );
  }
}
