import { Type } from 'class-transformer'
import { PaginationQueryDto } from '../../../dto/pagination-query.dto'
import { GetOrdersRequestQueryDto } from './get-orders-request-query.dto'

export class PaginateOrdersRequestQueryDto extends GetOrdersRequestQueryDto {
	@Type(() => PaginationQueryDto)
	paginationQuery: PaginationQueryDto
}
