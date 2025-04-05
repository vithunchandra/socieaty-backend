import {
	IsArray,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator'
import { ReservationSortBy, ReservationStatus } from '../../../enums/reservation.enum'
import { SortOrder } from '../../../enums/sort-order.enum'
import { Transform } from 'class-transformer'
import { fieldToDate, fieldToReservationSortBy, fieldToSortOrder, fieldToString } from '../../../utils/request_field_transformer.util'

export class GetReservationsRequestQueryDto {
	@IsString()
	@IsOptional()
	@Transform((data) => fieldToString(data))
	customerId?: string

	@IsString()
	@IsOptional()
	@Transform((data) => fieldToString(data))
	restaurantId?: string

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	createdAt?: Date

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	finishedAt?: Date

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	reservationTime?: Date

	@IsArray()
	@IsEnum(ReservationStatus, { each: true })
	status: ReservationStatus[]

	@IsOptional()
	@Transform((data) => fieldToReservationSortBy(data))
	sortBy?: ReservationSortBy

	@IsOptional()
	@Transform((data) => fieldToSortOrder(data))
	sortOrder?: SortOrder
}
