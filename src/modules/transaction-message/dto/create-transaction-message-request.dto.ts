import { IsNotEmpty, IsString } from "class-validator";

export class CreateTransactionMessageRequestDto {
    @IsString()
    @IsNotEmpty()
    message: string
}
