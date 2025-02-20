import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class PaginateMenuRequestDto {
	@IsString()
	@IsOptional()
	restaurantId?: string

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	priceConditionIds?: string[]

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	minRating?: number

	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	categoryIds?: number[]

	@IsString()
	@IsOptional()
	searchQuery?: string

	@IsNumber()
	@Type(() => Number)
	offset: number

	@IsNumber()
	@Type(() => Number)
	limit: number
}
