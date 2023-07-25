import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { FRStatus, FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFriendRequestDto } from './dto';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelDto } from 'src/channel/dto';
import { NotifGateway } from 'src/auth/notif/notif.gateway';
import { NotifService } from 'src/auth/notif/notif.service';

@Injectable()
export class FriendRequestService {
  constructor(
    private prisma: PrismaService,
    private channelService: ChannelService,
    private notifService: NotifService,
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
      (friendRequest.fromId !== userId && friendRequest.toId !== userId)
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

  async acceptAll(userId: number) {
    const requestIds = await this.prisma.friendRequest.findMany({
      where: {
        toId: userId,
        status: FRStatus.PENDING,
      },
    });
    console.log(`Found ${requestIds.length} pending requests`);
    requestIds.forEach((elem) => {
      this.prisma.friendRequest
        .update({
          where: {
            id: elem.id,
          },
          data: {
            status: FRStatus.ACCEPTED,
          },
        })
        .then((res) => {
          if (res.status !== FRStatus.ACCEPTED) {
            throw new InternalServerErrorException('Could not accept FR.');
          }
        });
      console.log(`Updated FR with user: ${elem.fromId}`);
      const dto: CreateChannelDto = {
        name: '',
        avatar: '',
        members: [elem.fromId, elem.toId],
      };
      console.log(dto);
      this.channelService.createChannel(elem.fromId, dto);
    });
    console.log(`Accepted all FRs: ${requestIds}.`);
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
