import { IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  avatar: string;
}
