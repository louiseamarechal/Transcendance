import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId } from 'src/common/decorators';
import { EditUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { PublicUser } from './types';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('sub') userId: number): Promise<PublicUser> {
    console.log('GET /user/me called');
    return this.userService.getUserById(userId);
  }

  @Get('all')
  getAll(@GetUserId() userId: number): Promise<
    {
      id: number | null;
      name: string | null;
      avatar: string | null;
      level: number | null;
    }[]
  > {
    console.log('GET /user/all called');
    return this.userService.getAll(userId);
  }

  @Patch('me')
  editUser(
    @GetUserId() userId: number,
    @Body() dto: EditUserDto,
  ): Promise<{
    id: number | null;
    login: string | null;
    name: string | null;
    level: number | null;
    avatar: string | null;
    statTotalGame: number | null;
    statTotalWin: number | null;
  }> {
    console.log('PATCH /user/me called', { dto });
    return this.userService.editUser(userId, dto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('login') userLogin: string,
    @GetUser('sub') userId: number,
  ) {
    console.log('POST /user/avatar called', file);
    return this.userService.uploadAvatar(file, userLogin, userId);
  }

  @Get('pending-request')
  getPendingFR(@GetUserId() userId: number) {
    console.log({ userId });
    console.log('[user/pending-request]: accessed controller');
    return this.userService.getPendingFR(userId);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    console.log(`GET /user/${id} called`);
    return this.userService.getUserById(id);
  }
}
