import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { PaginationQueryDto } from '../../../dto/pagination-query.dto'

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

	@ValidateNested()
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto
}
