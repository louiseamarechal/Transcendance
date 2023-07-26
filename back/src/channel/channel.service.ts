import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    ownerId: number,
    { name, avatar, members }: CreateChannelDto,
  ): Promise<{ id: number; name: string; avatar: string | null }> {
    let channels = await this.prisma.membersOnChannels.groupBy({
      by: ['channelId'],
      where: {
        userId: {
          in: members,
        },
      },
      having: {
        userId: {
          _count: {
            equals: members.length,
          },
        },
      },
    });
    channels = channels.filter((channel) => {
      return this.prisma.membersOnChannels
        .findMany({
          where: {
            channelId: channel.channelId,
          },
        })
        .then((channelMembers) => {
          return channelMembers.length === members.length;
        });
    });
    if (channels.length > 0) {
      throw new ConflictException({ channelId: channels[0].channelId });
    } else {
      const channel = await this.prisma.channel.create({
        data: {
          ownerId,
          name,
          avatar,
        },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      });
      console.log('Created channel.');
      await this.prisma.membersOnChannels.createMany({
        data: members.map((id: number) => {
          console.log(`Creating member ${id} in channel ${channel.id}`);
          return { channelId: channel.id, userId: id };
        }),
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
