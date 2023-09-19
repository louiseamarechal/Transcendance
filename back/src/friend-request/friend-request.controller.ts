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
import { FriendRequest } from '@prisma/client';

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
  ) {
    return this.friendRequestService.createFR(userId, toId);
  }

  @Get('my-friends')
  getMyFriends(@GetUserId() userId: number) {
    return this.friendRequestService.getMyFriends(userId);
  }

  @Get()
  getFRs(@GetUserId() userId: number) {
    return this.friendRequestService.getFRs(userId);
  }

  @Get('received')
  getReceivedFR(@GetUserId() userId: number) {
    return this.friendRequestService.getReceivedFR(userId);
  }

  @Get('with/:toId')
  getFRByToId(
    @GetUserId() userId: number,
    @Param('toId', ParseIntPipe) toId: number,
  ) {
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
  ) {
    return this.friendRequestService.getFRById(userId, id);
  }
}
