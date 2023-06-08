import { IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  @IsString()
	@IsNotEmpty()
  name: string;
}
