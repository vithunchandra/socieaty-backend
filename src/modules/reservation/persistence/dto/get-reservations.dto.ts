import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { ReservationSortBy, ReservationStatus } from '../../../../enums/reservation.enum'
import { SortOrder } from '../../../../enums/sort-order.enum'

export class GetReservationsDto {
	customerId?: string
	restaurantId?: string
	createdAt?: Date
	reservationTime?: Date
	finishedAt?: Date
	status: ReservationStatus[]
	sortBy?: ReservationSortBy
	sortOrder?: SortOrder
}
