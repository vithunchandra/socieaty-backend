import { Transform, Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class GetAllFoodMenuQueryDto {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	priceConditionIds?: string[]

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	minRating: number

	@IsOptional()
	@IsArray()
	@Type(() => Number)
	@IsNumber({}, { each: true })
	categoryIds?: number[]

	@IsString()
	searchQuery?: string
}
