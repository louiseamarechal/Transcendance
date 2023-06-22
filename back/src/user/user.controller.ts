import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId, Public } from 'src/common/decorators';
import { EditUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get('me')
  getMe(@GetUser('sub') userId: number) {
    console.log('GET /user/me called');
    return this.userService.getMe(userId);
  }

  @Get('all')
  getAll(): Promise<
    {
      id: number | null;
      name: string | null;
      avatar: string | null;
      level: number | null;
    }[]
  > {
    console.log('GET /user/all called');
    return this.userService.getAll();
  }

  @Patch('me')
  editUser(@GetUserId() userId: number, @Body() dto: EditUserDto) {
    console.log('PATCH /user/me called', { dto });
    return this.userService.editUser(userId, dto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser('login') userLogin: string,
  ) {
    console.log('POST /user/avatar called', file);
    return this.userService.uploadAvatar(file, userLogin);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    console.log(`GET /user/${id} called`);
    return this.userService.getUserById(id);
  }
}
