import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { GetReservationsDto } from './get-reservations.dto'

export class PaginateReservationsDto extends GetReservationsDto {
	paginationQuery: PaginationQueryDto
}
