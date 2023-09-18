import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import {
  BannedOnChannels,
  Channel,
  MembersOnChannels,
  VisType,
} from '@prisma/client';
import * as argon from 'argon2';
import { Socket, Namespace } from 'socket.io';
import { MembersOnChannel, MutedOnChannel, UpdateChannel } from './types';
import { NotifService } from 'src/notif/notif.service';
import { channel } from 'diagnostics_channel';
import { NoParamCallback, rename } from 'fs';
import { PublicUser } from '../../../shared/common/types/user.type';

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
    { name, avatar, members, visibility, password }: CreateChannelDto,
    origin: string,
  ): Promise<{
    id: number;
    name: string;
    avatar: string | null;
    visibility: VisType;
    members: { userId: number }[];
  }> {
    let hash: string | undefined = undefined;
    if (password) {
      const hash: string = await argon.hash(password);
    }
    const channel = await this.prisma.channel.create({
      data: {
        ownerId,
        name,
        avatar,
        visibility: visibility,
        passwordHash: hash,
        members: {
          create: members.map((m: number) => {
            return { userId: m };
          }),
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        visibility: true,
        members: {
          select: {
            user: true,
            userId: true,
          },
        },
      },
    });
    console.log({ channel });
    if (origin !== 'FR') {
      channel.members.map((member) => {
        if (member.user.id !== ownerId) {
          this.notifService.handleChatNotif(member.user.login);
        }
      });
    }
    console.log('Created channel.');
    return channel;
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
    banned: { userId: number }[];
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
    const forbidden = this.prisma.bannedOnChannels.findUnique({
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
        banned: {
          select: {
            userId: true,
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
    // visibility: VisType | null;
  }> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        ownerId: true,
        admins: {
          select: {
            userId: true,
          },
        },
      },
    });

    //	Check ownership of channel.
    if (
      !channel ||
      (!channel.admins.some(
        (el: { userId: number }) => el.userId === ownerId,
      ) &&
        channel.ownerId !== ownerId)
    )
      throw new ForbiddenException('Access to ressource denied');

    const updateDto: UpdateChannel = { name: dto.name, avatar: dto.avatar };
    if (dto.password) {
      updateDto.passwordHash = await argon.hash(dto.password);
    }
    return this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        ...updateDto,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
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
    if (!channel || channel.ownerId != ownerId)
      throw new ForbiddenException('Access to ressource denied');
    await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }

  // async uploadAvatar(file: Express.Multer.File) {
  async uploadAvatar(file: Express.Multer.File) {
    // const pictureName: string = `channel_.jpg`;
    // const pictureName: string = `channel_${channelId}.jpg`;
    const oldname: string = file.path;
    // const newname: string = `assets/${file.path}.jpeg`;
    console.log(file);
    console.log(oldname);
    // console.log(newname);

    // const cb: NoParamCallback = (err) => {
    //   if (err) throw err;
    //   console.log('Successfully renamed - AKA moved!');
    // };

    // try {
    //   rename(oldname, newname, cb);
    // } catch (err) {
    //   console.log(err);
    //   new InternalServerErrorException('Rename failed in uploadAvatar');
    // }
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
      await this.prisma.bannedOnChannels.findMany({
        where: {
          userId,
        },
        select: {
          channelId: true,
        },
      })
    ).map((element: BannedOnChannels) => {
      return element.channelId;
    });

    return this.prisma.channel.findMany({
      where: {
        OR: [
          {
            id: {
              in: channelIds,
              notIn: blockedIds,
            },
          },
          {
            visibility: VisType.PROTECTED,
            id: {
              notIn: channelIds,
            },
          },
          {
            visibility: VisType.PUBLIC,
            id: {
              notIn: channelIds,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        visibility: true,
        members: {
          select: {
            userId: true,
          },
        },
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

  /*============================================================================
                            Admin on Channels
==============================================================================*/

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

  /*============================================================================
                            Muted On Channel
==============================================================================*/

  // async createMutedOnChannel(
  //   channelId: number,
  //   mutedByUserId: number,
  //   mutedUserId: number,
  // ): Promise<MutedOnChannel> {
  //   return this.prisma.mutedByUserOnChannel
  //     .create({
  //       data: {
  //         channelId,
  //         mutedUserId,
  //         mutedByUserId,
  //       },
  //     })
  //     .catch((error) => {
  //       if (error.code === 'P2002')
  //         throw new ConflictException('Already exists');
  //       throw error;
  //     });
  // }

  // getMutedOnChannel(
  //   channelId: number,
  //   mutedByUserId: number,
  //   mutedUserId: number,
  // ): Promise<MutedOnChannel | null> {
  //   return this.prisma.mutedByUserOnChannel.findUnique({
  //     where: {
  //       channelId_mutedUserId_mutedByUserId: {
  //         channelId,
  //         mutedUserId,
  //         mutedByUserId,
  //       },
  //     },
  //   });
  // }

  // deleteMutedOnChannel(
  //   channelId: number,
  //   mutedByUserId: number,
  //   mutedUserId: number,
  // ) {
  //   this.prisma.mutedByUserOnChannel
  //     .delete({
  //       where: {
  //         channelId_mutedUserId_mutedByUserId: {
  //           channelId,
  //           mutedUserId,
  //           mutedByUserId,
  //         },
  //       },
  //     })
  //     .catch((error) => {
  //       if (error.code === 'P2002')
  //         throw new HttpException('Does not exist', HttpStatus.NO_CONTENT);
  //       throw error;
  //     });
  // }

  /*============================================================================
                            Members on channels
==============================================================================*/

  async createMemberOnChannel(
    userId: number,
    channelId: number,
    newId: number,
  ): Promise<MembersOnChannel | undefined> {
    const ownerId: number | undefined = await this.prisma.channel
      .findUnique({ where: { id: channelId } })
      .then((res): number | undefined => res?.ownerId);
    const admin = await this.prisma.adminsOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (admin === null && ownerId !== userId) {
      throw new ForbiddenException('User not a member');
    }
    return this.prisma.membersOnChannels.create({
      data: {
        channelId,
        userId: newId,
      },
    });
  }

  async createMembersOnChannel(
    userId: number,
    channelId: number,
    newIds: number[],
  ) {
    const ownerId: number | undefined = await this.prisma.channel
      .findUnique({ where: { id: channelId } })
      .then((res): number | undefined => res?.ownerId);
    const admin = await this.prisma.adminsOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (admin === null && ownerId !== userId) {
      throw new ForbiddenException('User not a member');
    }
    await this.prisma.membersOnChannels.createMany({
      data: newIds.map(
        (userId: number): { channelId: number; userId: number } => {
          return { channelId, userId };
        },
      ),
    });
  }

  async joinChannel(
    userId: number,
    channelId: number,
    password: string | undefined,
  ): Promise<PublicUser> {
    const channel: Channel | null = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new ForbiddenException('Channel id not found.');
    } else if (channel.visibility === VisType.PRIVATE) {
      throw new ForbiddenException('Cannot join PRIVATE channel');
    } else if (
      channel.visibility === VisType.PROTECTED &&
      (!password ||
        (channel.passwordHash &&
          (await argon.verify(channel.passwordHash, password))))
    ) {
      throw new ConflictException('Wrong password');
    } else {
      return (
        await this.prisma.membersOnChannels.create({
          data: {
            channelId,
            userId: userId,
          },
          select: {
            user: {
              select: {
                id: true,
                login: true,
                name: true,
                level: true,
                avatar: true,
                status: true,
                blockedUsers: {
                  select: {
                    blockedId: true,
                  },
                },
              },
            },
          },
        })
      ).user;
    }
  }

  async removeMemberOnChannel(
    userId: number,
    channelId: number,
    removeId: number,
  ): Promise<MembersOnChannel | undefined> {
    console.log(`In removeMemberOnChannel ${removeId} in ${channelId}`);
    const ownerId: number | undefined = await this.prisma.channel
      .findUnique({ where: { id: channelId } })
      .then((res): number | undefined => res?.ownerId);
    const admin = await this.prisma.adminsOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (admin === null && ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    const userAdmin = await this.prisma.adminsOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId: removeId,
        },
      },
    });
    console.log({ userAdmin });
    if (userAdmin !== null) {
      await this.prisma.adminsOnChannels.delete({
        where: {
          channelId_userId: {
            channelId,
            userId: removeId,
          },
        },
      });
    }
    return this.prisma.membersOnChannels.delete({
      where: {
        channelId_userId: {
          channelId,
          userId: removeId,
        },
      },
    });
  }

  /*============================================================================
                            Blocked on channels
==============================================================================*/

  async createBlockedOnChannel(
    userId: number,
    channelId: number,
    blockedId: number,
  ): Promise<MembersOnChannel | undefined> {
    const ownerId: number | undefined = await this.prisma.channel
      .findUnique({ where: { id: channelId } })
      .then((res): number | undefined => res?.ownerId);
    const admin = await this.prisma.adminsOnChannels.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
    if (admin === null && ownerId !== userId) {
      throw new ForbiddenException('User not a member');
    }
    console.log(`Add banned member: ${blockedId}`);
    return this.prisma.bannedOnChannels.create({
      data: {
        channelId,
        userId: blockedId,
      },
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
    console.log(
      `[channelService] receiving sendMessage from channel: ${channelId}`,
    );
  }
}
