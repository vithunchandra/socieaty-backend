
import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator'
import { PaginationDirection } from '../../../enums/pagination-direction.enum'

export class GetPaginatedPostQueryRequestDto {
	@IsNumber()
	@Type(() => Number)
	offset: number

	@IsNumber()
	@Type(() => Number)
	limit: number

	@IsOptional()
	@IsString()
	authorId?: string
}
