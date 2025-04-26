import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { UserRole } from '../User.entity'

export class PaginateUsersQueryDto {
	paginationQuery: PaginationQueryDto
	searchQuery?: string
	role?: UserRole
	includeDeleted?: boolean
}
