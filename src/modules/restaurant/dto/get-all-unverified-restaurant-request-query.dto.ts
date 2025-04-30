import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class GetAllUnverifiedRestaurantRequestQueryDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	@Type(() => Number)
	themeIds?: number[]
}
