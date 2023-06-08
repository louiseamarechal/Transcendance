import { Status2fa } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  hashedRT: string;

  @IsOptional()
  @IsPositive()
  level?: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  s2fa?: Status2fa;

  @IsOptional()
  @IsPositive()
  statTotalGame?: number;

  @IsOptional()
  @IsPositive()
  statTotalWin?: number;
}
