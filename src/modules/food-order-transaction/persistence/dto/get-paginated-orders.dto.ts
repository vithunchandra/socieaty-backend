import { PaginationQueryDto } from '../../../../dto/pagination-query.dto'
import { GetOrdersDto } from './get-orders.dto'

export class GetPaginatedOrdersDto extends GetOrdersDto {
	paginationQuery: PaginationQueryDto
}
