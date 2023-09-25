import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUserId } from 'src/common/decorators';
import { ChannelService } from './channel.service';
import { CreateChannelDto, EditChannelDto } from './dto';
import { VisType } from '@prisma/client';
import { MembersOnChannel, MutedOnChannel } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

import { PublicUser } from '../../../shared/common/types/user.type';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  createChannel(
    @GetUserId() userId: number,
    @Body() dto: CreateChannelDto,
  ): Promise<{
    id: number;
    name: string;
    avatar: string | null;
    visibility: VisType;
    members: { userId: number }[];
  }> {
    return this.channelService.createChannel(userId, dto, '');
  }

  @Get('my-channels')
  getUserChannels(@GetUserId() userId: number): Promise<
    {
      name: string | null;
      avatar: string | null;
      id: number;
      visibility: string;
      members: { userId: number }[];
    }[]
  > {
    return this.channelService.getUserChannels(userId);
  }

  @Get('correspondent/:id')
  getCorrespondent(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) channelId: number,
  ): Promise<{ name: string; avatar: string | null; id: number } | null> {
    return this.channelService.getCorrespondent(userId, channelId);
  }

  @Get(':id')
  getChannel(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) channelId: number,
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
    console.log('Called Get channel id: ' + channelId);
    return this.channelService.getChannelById(userId, channelId);
  }

  @Get()
  getChannels(@GetUserId() userId: number): Promise<
    {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      ownerId: number;
      name: string;
      avatar: string | null;
      passwordHash: string | null;
      visibility: VisType;
    }[]
  > {
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

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.channelService.uploadAvatar(file);
  }

  /*============================================================================
                            Admin on Channels
==============================================================================*/

  @Post('admin/:id')
  addAdminOnChannel(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() dto: { userId: number },
  ): Promise<{ channelId: number; userId: number }> {
    return this.channelService.createAdminOnChannel(channelId, dto.userId);
  }

  @Delete('admin/:id')
  removeAdminOnChannel(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() dto: { userId: number },
  ): Promise<{
    channelId: number;
    userId: number;
  }> {
    return this.channelService.deleteAdminOnChannel(channelId, dto.userId);
  }

  /*============================================================================
                            Members on channels
==============================================================================*/

  @Post('member/:channelId/:userId')
  addMemberOnChannel(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('userId', ParseIntPipe) newId: number,
  ): Promise<MembersOnChannel | undefined> {
    return this.channelService.createMemberOnChannel(userId, channelId, newId);
  }

  @Post('members/:channelId')
  addMembersOnChannel(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() dto: { ids: number[] },
  ) {
    return this.channelService.createMembersOnChannel(
      userId,
      channelId,
      dto.ids,
    );
  }

  @Patch('join/:channelId')
  joinChannel(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() dto: { password?: string },
  ): Promise<PublicUser> {
    return this.channelService.joinChannel(userId, channelId, dto?.password);
  }

  @Delete('member/:channelId/:userId')
  removeMemberOnChannel(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('userId', ParseIntPipe) removeId: number,
  ): Promise<MembersOnChannel | undefined> {
    console.log(`Called remove member ${removeId} on channel ${channelId}`);
    return this.channelService.removeMemberOnChannel(
      userId,
      channelId,
      removeId,
    );
  }

  /*============================================================================
                            Blocked on channels
==============================================================================*/

  @Post('blocked/:channelId/:blockedId')
  addBlockedOnChannel(
    @GetUserId() userId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('blockedId', ParseIntPipe) blockedId: number,
  ): Promise<MembersOnChannel | undefined> {
    return this.channelService.createBlockedOnChannel(
      userId,
      channelId,
      blockedId,
    );
  }
}
