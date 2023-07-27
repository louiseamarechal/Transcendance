import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(
    senderId: number,
    channelId: number,
    dto: CreateMessageDto,
  ): Promise<{
    id: number;
    createdAt: Date;
    senderId: number;
    sender: { name: string };
    channelId: number;
    body: string;
  }> {
    // socket
    return this.prisma.message.create({
      data: {
        channelId,
        senderId,
        body: dto.body,
      },
      select: {
        id: true,
        createdAt: true,
        senderId: true,
        sender: {
          select: {
            name: true,
          },
        },
        channelId: true,
        body: true,
      },
    });
  }

  async getChannelMessages(channelId: number): Promise<
    {
      id: number;
      createdAt: Date;
      senderId: number;
      sender: { name: string };
      channelId: number;
      body: string;
    }[]
  > {
    return this.prisma.message.findMany({
      where: {
        channelId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        createdAt: true,
        senderId: true,
        sender: {
          select: {
            name: true,
          },
        },
        channelId: true,
        body: true,
      },
    });
  }
}
