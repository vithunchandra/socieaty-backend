import { IsBoolean } from "class-validator";

export class LikePostRequestDto{
    @IsBoolean()
    isLiked: boolean
}