import { IsNotEmpty, IsString } from "class-validator"

export class CreatePostCommentRequestDto {
    @IsNotEmpty()
    @IsString()
    text: string
}