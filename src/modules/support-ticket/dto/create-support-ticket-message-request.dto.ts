import { IsNotEmpty, IsString } from "class-validator";

export class CreateSupportTicketMessageRequestDto {
    @IsNotEmpty()
    @IsString()
	message: string
}
