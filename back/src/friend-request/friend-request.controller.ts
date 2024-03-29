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
import { FriendRequestService } from './friend-request.service';
import { GetUserId } from 'src/common/decorators';
import { CreateFriendRequestDto, EditFriendRequestDto } from './dto';
import { FRStatus, FriendRequest } from '@prisma/client';
import { PublicUser } from '../../../shared/common/types/user.type';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Post()
  createFR(
    @GetUserId() userId: number,
    @Body() dto: CreateFriendRequestDto,
  ): Promise<FriendRequest> {
    return this.friendRequestService.createFR(userId, dto.toId);
  }

  @Post(':id')
  createFRById(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) toId: number,
  ): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    fromId: number;
    toId: number;
    status: FRStatus;
  }> {
    return this.friendRequestService.createFR(userId, toId);
  }

  @Get('my-friends')
  getMyFriends(@GetUserId() userId: number): Promise<PublicUser[]> {
    return this.friendRequestService.getMyFriends(userId);
  }

  @Get()
  getFRs(@GetUserId() userId: number): Promise<FriendRequest[]> {
    return this.friendRequestService.getFRs(userId);
  }

  @Get('received')
  getReceivedFR(@GetUserId() userId: number): Promise<
    {
      fromId: number;
      toId: number;
      status: FRStatus;
    }[]
  > {
    return this.friendRequestService.getReceivedFR(userId);
  }

  @Get('with/:toId')
  getFRByToId(
    @GetUserId() userId: number,
    @Param('toId', ParseIntPipe) toId: number,
  ): Promise<FriendRequest[]> {
    return this.friendRequestService.getFRByToId(userId, toId);
  }

  @Patch(':id')
  editFRById(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditFriendRequestDto,
  ): Promise<FriendRequest> {
    return this.friendRequestService.editFRById(userId, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteFRById(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.friendRequestService.deleteFRById(userId, id);
  }

  @Get(':id')
  getFRById(
    @GetUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FriendRequest[]> {
    return this.friendRequestService.getFRById(userId, id);
  }
}
