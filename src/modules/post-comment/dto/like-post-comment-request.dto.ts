import { IsBoolean, isBoolean, IsNotEmpty, isString } from "class-validator";

export class LikePostCommentRequestDto{
    @IsBoolean()
    isLiked: boolean
}