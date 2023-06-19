import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
}