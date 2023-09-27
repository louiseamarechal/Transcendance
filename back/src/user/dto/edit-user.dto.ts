import { Status2fa, UserStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  hashedRT?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
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

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
