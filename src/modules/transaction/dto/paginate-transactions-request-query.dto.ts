import { Transform, Type } from 'class-transformer'
import { PaginationQueryDto } from '../../../dto/pagination-query.dto'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import {
	fieldToDate,
	fieldToSortOrder,
	fieldToString,
	fieldToTransactionServiceType,
	fieldToTransactionSortBy,
	fieldToTransactionStatus
} from '../../../utils/request_field_transformer.util'
import { SortOrder } from '../../../enums/sort-order.enum'
import {
	TransactionServiceType,
	TransactionSortBy,
	TransactionStatus
} from '../../../enums/transaction.enum'

export class PaginateTransactionsRequestQueryDto {
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto

	@IsOptional()
	@IsString()
	searchQuery?: string

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
	rangeStartDate?: Date

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	rangeEndDate?: Date

	@IsOptional()
	@Transform((data) => fieldToTransactionServiceType(data))
	serviceType?: TransactionServiceType

	@IsOptional()
	@IsArray()
	@IsEnum(TransactionStatus, { each: true })
	status?: TransactionStatus[]

	@IsOptional()
	@Transform((data) => fieldToTransactionSortBy(data))
	sortBy?: TransactionSortBy

	@IsOptional()
	@Transform((data) => fieldToSortOrder(data))
	sortOrder?: SortOrder
}
