import { VisType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EditChannelDto {
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsOptional()
  @IsEnum(VisType)
  visibility?: VisType;

  @IsOptional()
  @IsString()
  avatar?: string;
}
