import { VisType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EditChannelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  password?: string | undefined;

  // @IsOptional()
  // @IsEnum(VisType)
  // visibility: VisType;
}
