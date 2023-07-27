import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsNotEmpty()
  toId: number;
}
