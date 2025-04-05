import { Type } from 'class-transformer'
import { PaginationQueryDto } from '../../../dto/pagination-query.dto'
import { GetReservationsRequestQueryDto } from './get-reservations-request-query.dto'

export class PaginateOrdersRequestQueryDto extends GetReservationsRequestQueryDto {
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto
}
