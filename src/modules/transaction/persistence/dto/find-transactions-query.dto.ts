import { SortOrder } from '../../../../enums/sort-order.enum'
import {
	TransactionServiceType,
	TransactionSortBy,
	TransactionStatus
} from '../../../../enums/transaction.enum'

export class FindTransactionsQueryDto {
	searchQuery?: string
	customerId?: string
	restaurantId?: string
	rangeStartDate?: Date
	rangeEndDate?: Date
	serviceType?: TransactionServiceType
	status?: TransactionStatus[]
	sortBy?: TransactionSortBy
	sortOrder?: SortOrder
}
