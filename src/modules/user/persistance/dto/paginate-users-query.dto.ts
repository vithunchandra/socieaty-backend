import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { UserRole } from '../User.entity'

export class PaginateUsersQueryDto {
	paginationQuery: PaginationQueryDto
	name?: string
	email?: string
	role?: UserRole
	includeDeleted?: boolean
}
