import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { BlockedOnChannels, MembersOnChannels, VisType } from '@prisma/client';
import { Socket, Namespace } from 'socket.io';
import { MutedOnChannel } from './types';
import { NotifService } from 'src/notif/notif.service';

@Injectable()
export class ChannelService {
  server: Namespace;
  constructor(
    private prisma: PrismaService,
    private notifService: NotifService,
  ) {}

  /* =============================================================================
															CRUD FUNCTIONS
============================================================================= */

  async createChannel(
    ownerId: number,
    { name, avatar, members }: CreateChannelDto,
  ): Promise<{ id: number; name: string; avatar: string | null }> {
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
            equals: members.length,
          },
        },
      },
    });
    console.log({ channels });
    const filteredChannels = channels.filter(async (channel) => {
      const channelMembers = await this.prisma.membersOnChannels.findMany({
        where: {
          channelId: channel.channelId,
        },
      });
      if (channelMembers.length === members.length) {
        return true;
      } else {
        return false;
      }
    });
    // console.log(`found ${filteredChannels.length} with same members.`);
    // console.log({ filteredChannels });
    if (filteredChannels.length > 0) {
      throw new ConflictException({ channelId: filteredChannels[0].channelId });
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
          members: {
            select: {
              user: true,
            },
          },
        },
      });
      channel.members.map((member) => {
        if (member.user.id !== ownerId) {
          this.notifService.handleChatNotif(member.user.login);
        }
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
  ): Promise<{
    id: number;
    ownerId: number;
    name: string;
    avatar: string | null;
    passwordHash: string | null;
    visibility: string;
    members: {
      user: {
        id: number;
        name: string;
        avatar: string | null;
        level: number;
        login: string;
      };
    }[];
    admins: { userId: number }[];
    blocked: { userId: number }[];
    muted: {
      mutedUserId: number;
      mutedByUserId: number;
    }[];
  } | null> {
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
      select: {
        id: true,
        ownerId: true,
        name: true,
        avatar: true,
        passwordHash: true,
        visibility: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                level: true,
                login: true,
              },
            },
          },
        },
        admins: {
          select: {
            userId: true,
          },
        },
        blocked: {
          select: {
            userId: true,
          },
        },
        muted: {
          select: {
            mutedUserId: true,
            mutedByUserId: true,
          },
        },
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

  async createAdminOnChannel(
    channelId: number,
    userId: number,
  ): Promise<{ channelId: number; userId: number }> {
    return this.prisma.adminsOnChannels
      .create({
        data: {
          channelId,
          userId,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002')
          throw new ConflictException('Already exists');
        throw error;
      });
  }

  async deleteAdminOnChannel(
    channelId: number,
    userId: number,
  ): Promise<{ channelId: number; userId: number }> {
    return this.prisma.adminsOnChannels
      .delete({
        where: {
          channelId_userId: {
            channelId,
            userId,
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2002')
          throw new ConflictException('Does not exist');
        throw error;
      });
  }

  createMutedOnChannel(
    channelId: number,
    mutedByUserId: number,
    mutedUserId: number,
  ): Promise<MutedOnChannel> {
    return this.prisma.mutedByUserOnChannel
      .create({
        data: {
          channelId,
          mutedUserId,
          mutedByUserId,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002')
          throw new ConflictException('Already exists');
        throw error;
      });
  }

  getMutedOnChannel(
    channelId: number,
    mutedByUserId: number,
    mutedUserId: number,
  ): Promise<MutedOnChannel | null> {
    return this.prisma.mutedByUserOnChannel.findUnique({
      where: {
        channelId_mutedUserId_mutedByUserId: {
          channelId,
          mutedUserId,
          mutedByUserId,
        },
      },
    });
  }

  deleteMutedOnChannel(
    channelId: number,
    mutedByUserId: number,
    mutedUserId: number,
  ) {
    this.prisma.mutedByUserOnChannel
      .delete({
        where: {
          channelId_mutedUserId_mutedByUserId: {
            channelId,
            mutedUserId,
            mutedByUserId,
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2002')
          throw new HttpException('Does not exist', HttpStatus.NO_CONTENT);
        throw error;
      });
  }

  /* =============================================================================
                            SOCKET FUNCTIONS
  ============================================================================= */

  handleJoinRoom(client: Socket, roomName: string) {
    const room = roomName;
    client.join(room);
    // const rooms = Object.keys(client.rooms);
    // console.log(rooms);
    client.to(room).emit('welcome');
  }

  handleLeaveRoom(client: Socket) {
    const connectedRooms = this.server.adapter.rooms;
    console.log(connectedRooms);
    connectedRooms.forEach((value, key: string) => {
      if (client.id === key) {
        return;
      }
      client.leave(key);
    });
  }

  handleSendMessage(server: Namespace, channelId: number) {
    server.to(`channel_${channelId}`).emit('server.channel.messageUpdate');
  }
}
