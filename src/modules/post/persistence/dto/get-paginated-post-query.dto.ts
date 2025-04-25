import { UserRole } from '../../../user/persistance/User.entity'
import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'

export class GetPaginatedPostQueryDto {
	paginationQuery: PaginationQueryDto
	authorId?: string
	role?: UserRole
	postId?: string
	title?: string
}
