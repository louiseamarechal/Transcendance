import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  toId: number;
}
