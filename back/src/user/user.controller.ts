import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, GetUserId } from 'src/common/decorators';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	getUser(@GetUser() user: User) {
		return user;
	}

	@Patch('me')
	editUser(@GetUserId() userId: number, @Body() dto: EditUserDto) {
		return (this.userService.editUser(userId, dto));
	}
}
