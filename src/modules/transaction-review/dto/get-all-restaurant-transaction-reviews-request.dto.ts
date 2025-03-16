import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetAllRestaurantTransactionReviewsRequestDto {
	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	rating: number
}
