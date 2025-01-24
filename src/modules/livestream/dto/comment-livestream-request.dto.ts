import { IsString } from "class-validator";

export class CommentLivestreamRequestDto{
    @IsString()
    text: string
}