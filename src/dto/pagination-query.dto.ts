import { Type } from "class-transformer"
import { IsNumber } from "class-validator"

export class PaginationQueryDto{
    @IsNumber()
	@Type(() => Number)
	offset: number

	@IsNumber()
	@Type(() => Number)
	limit: number
}