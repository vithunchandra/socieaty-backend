import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { SortOrder } from '../../../../enums/sort-order.enum'
import {
	TransactionServiceType,
	TransactionSortBy,
	TransactionStatus
} from '../../../../enums/transaction.enum'
import { FindTransactionsQueryDto } from './find-transactions-query.dto'

export class PaginateTransactionsQueryDto extends FindTransactionsQueryDto {
	paginationQuery: PaginationQueryDto
}
