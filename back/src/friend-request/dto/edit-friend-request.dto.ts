import { FRStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class EditFriendRequestDto {
	@IsOptional()
	@IsEnum(FRStatus)
	status: FRStatus;
}