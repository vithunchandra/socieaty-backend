import { IsNotEmpty, IsString } from "class-validator";

export class StartLivestreamRequestDto{
    @IsNotEmpty()
    @IsString()
    roomTitle: string
}