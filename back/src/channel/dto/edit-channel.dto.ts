import { VisType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditChannelDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  password?: string | undefined;
}
