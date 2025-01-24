import { IsBoolean } from "class-validator";

export class LikeLivestreamRequestDto{
    @IsBoolean()
    isLiked: boolean
}