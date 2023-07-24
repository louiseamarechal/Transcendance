import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message, User } from '@prisma/client';
import { GetUserId } from 'src/common/decorators';
import { CreateMessageDto } from './dto/create-message.dto';
import { channel } from 'diagnostics_channel';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post(':channelId')
  createMessage(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() dto: CreateMessageDto,
  ): Promise<{
    id: number;
    createdAt: Date;
    senderId: number;
    sender: { name: string };
    channelId: number;
    body: string;
  }> {
    return this.messageService.createMessage(userId, channelId, dto);
  }

  @Get(':channelId')
  getChannelMessages(
    @Param('channelId', ParseIntPipe) channelId: number,
  ): Promise<
    {
      id: number;
      createdAt: Date;
      senderId: number;
      sender: { name: string };
      channelId: number;
      body: string;
    }[]
  > {
    console.log('Called get messages on channel ' + channelId);
    return this.messageService.getChannelMessages(channelId);
  }

  @Patch()
  patchMessage() {}

  @Delete()
  deleteMessage() {}
}
