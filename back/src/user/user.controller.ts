import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId, Public } from 'src/common/decorators';
import { EditUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { Response } from 'express';
import { PublicUser } from '../../../shared/common/types/user.type';
import { BlockedUser } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('sub') userId: number): Promise<PublicUser> {
    return this.userService.getUserById(userId);
  }

  @Public()
  @Get('avatarById/:id')
  getAvatarById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.userService.getAvatarById(id, res);
  }

  @Public()
  @Get('avatarByFile/:file')
  getAvatar(@Param('file') file: string, @Res() res: Response) {
    return this.userService.getAvatarByFile(file, res);
  }

  @Get('all')
  getAll(@GetUserId() userId: number): Promise<PublicUser[]> {
    return this.userService.getAll(userId);
  }

  @Patch('me')
  editUser(
    @GetUserId() userId: number,
    @Body() dto: EditUserDto,
  ): Promise<PublicUser> {
    return this.userService.editUser(userId, dto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('login') userLogin: string,
    @GetUser('sub') userId: number,
  ): Promise<string> {
    return this.userService.uploadAvatar(file, userLogin, userId);
  }

  @Get('pending-request')
  getPendingFR(@GetUserId() userId: number): Promise<
    {
      id: number;
      name: string;
      level: number;
      avatar: string | null;
    }[]
  > {
    console.log({ userId });
    console.log('[user/pending-request]: accessed controller');
    return this.userService.getPendingFR(userId);
  }

  @Post('block/:blockedId')
  createBlockedUser(
    @GetUserId() userId: number,
    @Param('blockedId', ParseIntPipe) blockedId: number,
  ) {
    return this.userService.createBlockedUser(userId, blockedId);
  }

  @Get('blocked')
  getBlockedUser(@GetUserId() userId: number): Promise<number[]> {
    return this.userService.getBlockedUser(userId);
  }

  @Get('blockedBy/:blockerId')
  getBlockedByUser(
    @GetUserId() userId: number,
    @Param('blockerId', ParseIntPipe) blockerId: number,
  ): Promise<BlockedUser | null> {
    return this.userService.getBlockedByUser(userId, blockerId);
  }

  @Delete('block/:blockedId')
  deleteBlockedUser(
    @GetUserId() userId: number,
    @Param('blockedId', ParseIntPipe) blockedId: number,
  ): Promise<BlockedUser> {
    return this.userService.deleteBlockedUser(userId, blockedId);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return this.userService.getUserById(id);
  }
}
