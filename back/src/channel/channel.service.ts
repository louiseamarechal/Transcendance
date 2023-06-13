import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, EditChannelDto } from './dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(ownerId: number, dto: CreateChannelDto) {
    const channel = await this.prisma.channel.create({
      data: {
        ownerId,
        ...dto,
      },
    });
    return channel;
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
