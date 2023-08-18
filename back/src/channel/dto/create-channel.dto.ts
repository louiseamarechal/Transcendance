import { VisType } from '@prisma/client';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
	MaxLength,
} from 'class-validator';

const validVisibility = ['PUBLIC', 'PROTECTED', 'PRIVATE'];

export class CreateChannelDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsArray()
  @IsNotEmpty()
  members: number[];

  @IsString()
	@IsNotEmpty()
  @IsIn(validVisibility)
  visibility?: VisType;

	@IsOptional()
	@IsNotEmpty()
	@MaxLength(15)
	password?: string;
}
