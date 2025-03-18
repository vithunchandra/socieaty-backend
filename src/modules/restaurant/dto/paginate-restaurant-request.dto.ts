import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class PaginateRestaurantRequestDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	priceConditionIds?: string[]

	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	@Type(() => Number)
	themeIds?: number[]

	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	@Type(() => Number)
	categoryIds?: number[]

	@IsNumber()
	@Type(() => Number)
	offset: number

	@IsNumber()
	@Type(() => Number)
	limit: number
}
