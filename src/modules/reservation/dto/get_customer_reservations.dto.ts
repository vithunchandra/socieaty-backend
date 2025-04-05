import { IsArray, IsEnum, IsOptional } from 'class-validator'
import { ReservationSortBy, ReservationStatus } from '../../../enums/reservation.enum'
import { SortOrder } from '../../../enums/sort-order.enum'

export class GetCustomerReservationsDto {
	@IsArray()
	@IsEnum(ReservationStatus, { each: true })
	status: ReservationStatus[]
	@IsOptional()
	@IsEnum(ReservationSortBy)
	sortBy?: ReservationSortBy
	@IsOptional()
	@IsEnum(SortOrder)
	sortOrder?: SortOrder
}
