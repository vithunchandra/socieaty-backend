
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator'
import { PaginationDirection } from '../../../enums/pagination-direction.enum'
import { UserRole } from '../../user/persistance/User.entity'
import { fieldToUserRole } from '../../../utils/request_field_transformer.util'
import { PaginationQueryDto } from '../../../dto/pagination-query.dto'

export class GetPaginatedPostQueryRequestDto {
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto

	// @IsOptional()
	// @IsString()
	// postId?: string

	// @IsOptional()
	// @IsString()
	// title?: string

	@IsOptional()
	@IsString()
	searchQuery?: string

	@IsOptional()
	@IsString()
	authorId?: string

	@IsOptional()
	@Transform((value) => fieldToUserRole(value))
	role?: UserRole
}
