import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import {
  BlockedOnChannels,
  Channel,
  MembersOnChannels,
  VisType,
} from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  /* =============================================================================
															CRUD FUNCTIONS
============================================================================= */

  async createChannel(
    ownerId: number,
    { name, avatar, members }: CreateChannelDto,
  ) {
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

  async getChannelById(
    userId: number,
    channelId: number,
  ): Promise<Channel | null> {
    const channel = this.prisma.membersOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (!channel) throw new ForbiddenException('User not a member');
    const forbidden = this.prisma.blockedOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (forbidden === null)
      throw new ForbiddenException('User blocked on channel');
    return this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
  }

  async editChannelById(
    ownerId: number,
    channelId: number,
    dto: EditChannelDto,
  ): Promise<{
    id: number | null;
    name: string | null;
    avatar: string | null;
    visibility: VisType | null;
  }> {
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

  /* =============================================================================
													HIGH LEVEL FUNCTIONS
============================================================================= */

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

  async getCorrespondent(
    userId: number,
    channelId: number,
  ): Promise<{ name: string; avatar: string | null; id: number } | null> {
    const membersIds = await this.prisma.membersOnChannels.findMany({
      where: {
        channelId,
      },
    });
    if (membersIds.length !== 2) {
      throw new ConflictException('Channel is not a DM channel');
    }
    return this.prisma.user.findUnique({
      where: {
        id: membersIds.filter((elem) => {
          return elem.userId !== userId;
        })[0].userId,
      },
			select: {
				id: true,
				name: true,
				avatar: true,
			},
    });
  }
}
