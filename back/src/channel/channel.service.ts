import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { BlockedOnChannels, MembersOnChannels } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    ownerId: number,
    { name, avatar, members }: CreateChannelDto,
  ) {
    const channels = await this.prisma.membersOnChannels.groupBy({
      by: ['channelId'],
      where: {
        userId: {
          in: members,
        },
      },
      having: {
        userId: {
          _count: {
            gte: members.length,
          },
        },
      },
    });
    if (channels.length > 0) {
      throw new ConflictException({channelId: channels[0]});
    } else {
      const channel = await this.prisma.channel.create({
        data: {
          ownerId,
          name,
          avatar,
        },
      });
      this.prisma.membersOnChannels.createMany({
        data: [
          { channelId: channel.id, userId: ownerId },
          ...members.map((id: number) => {
            return { channelId: channel.id, userId: id };
          }),
        ],
      });
      return channel;
    }
  }

  getChannels(ownerId: number) {
    return this.prisma.channel.findMany({
      where: {
        ownerId,
      },
    });
  }

  async getUserChannels(userId: number) {
    const channelIds: number[] = (
      await this.prisma.membersOnChannels.findMany({
        where: {
          userId,
        },
        select: {
          channelId: true,
        },
      })
    ).map((element: MembersOnChannels) => {
      return element.channelId;
    });
    const blockedIds: number[] = (
      await this.prisma.blockedOnChannels.findMany({
        where: {
          userId,
        },
        select: {
          channelId: true,
        },
      })
    ).map((element: BlockedOnChannels) => {
      return element.channelId;
    });

    return this.prisma.channel.findMany({
      where: {
        id: {
          in: channelIds,
          notIn: blockedIds,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
  }

  getChannelById(ownerId: number, channelId: number) {
    return this.prisma.channel.findMany({
      where: {
        id: channelId,
        ownerId,
      },
    });
  }

  async editChannelById(
    ownerId: number,
    channelId: number,
    dto: EditChannelDto,
  ) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    //	Check ownership of channel.
    if (!channel || channel?.ownerId != ownerId)
      throw new ForbiddenException('Access to ressource denied');

    return this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteChannelById(ownerId: number, channelId: number) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    //	Check ownership of channel.
    if (!channel || channel?.ownerId != ownerId)
      throw new ForbiddenException('Access to ressource denied');
    await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }
}
