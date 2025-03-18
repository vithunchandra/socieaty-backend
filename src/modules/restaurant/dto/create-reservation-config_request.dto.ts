import { Type } from "class-transformer"
import { IsArray, IsNumber, IsString } from "class-validator"

export class CreateReservationConfigRequestDto {
    @IsNumber()
    @Type(() => Number)
    maxPerson: number

    @IsNumber()
    @Type(() => Number)
    minCostPerPerson: number

    @IsNumber()
    @Type(() => Number)
    timeLimit: number

    @IsArray()
    @IsString({ each: true })
    facilities: string[]
}