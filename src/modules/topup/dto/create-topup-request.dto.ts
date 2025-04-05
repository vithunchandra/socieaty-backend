import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateTopupRequestDto{
    @IsNumber()
    @Type(() => Number)
    grossAmount: number
}