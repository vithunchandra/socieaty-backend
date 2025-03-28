import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { ReservationStatus } from '../../../enums/reservation.enum'
import { SortOrder } from '../../../enums/sort-order.enum'

export enum ReservationSortBy {
	reservationTime = 'reservationTime',
	createdAt = 'createdAt',
	updatedAt = 'updatedAt'
}

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
