import { IsNotEmpty, IsNumber } from "class-validator";

export class AdminDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;
}