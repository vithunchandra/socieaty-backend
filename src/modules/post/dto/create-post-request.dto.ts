import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, isNotEmptyObject, IsObject, IsString, Validate, ValidateNested } from "class-validator";
import { Point } from "src/modules/restaurant/persistence/custom-type/PointType";

export class CreatePostRequestDto{
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    caption: string

}