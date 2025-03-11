import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTransactionReviewRequestDto {
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	rating: number

	@IsString()
	review: string
}
