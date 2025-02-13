import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateFoodMenuRequestDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	price: number

	@IsString()
	@IsNotEmpty()
	description: string

	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	estimatedTime: number

	@Type(() => Number)
	@IsArray()
	@IsNumber({}, { each: true })
	categories: number[]
}
