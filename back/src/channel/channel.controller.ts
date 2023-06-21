import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser, GetUserId } from 'src/common/decorators';
import { ChannelService } from './channel.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { VisType } from '@prisma/client';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  createChannel(@GetUserId() userId: number, @Body() dto: CreateChannelDto) {
    return this.channelService.createChannel(userId, dto);
  }

  @Get('my-channels')
  getUserChannels(
    @GetUserId() userId: number,
  ): Promise<{ name: string | null; avatar: string | null; id: number }[]> {
    return this.channelService.getUserChannels(userId);
  }

  @Get(':id')
  getChannel(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) channelId: number,
  ) {
    return this.channelService.getChannelById(userId, channelId);
  }

  @Get()
  getChannels(@GetUserId() userId: number) {
    return this.channelService.getChannels(userId);
  }

  @Patch(':id')
  editChannel(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) channelId: number,
    @Body() dto: EditChannelDto,
  ): Promise<{
    id: number | null;
    name: string | null;
    avatar: string | null;
    visibility: VisType | null;
  }> {
    return this.channelService.editChannelById(userId, channelId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChannel(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) channelId: number,
  ) {
    return this.channelService.deleteChannelById(userId, channelId);
  }
}
