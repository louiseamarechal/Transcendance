import { Status2fa } from '@prisma/client';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  hashedRT?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPositive()
  level?: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(Status2fa)
  s2fa?: Status2fa;

  @IsOptional()
  @IsPositive()
  statTotalGame?: number;

  @IsOptional()
  @IsPositive()
  statTotalWin?: number;
}
