import { PaginationQueryDto } from "../../../../dto/pagination-query.dto"


export class PaginateRestaurantDto {
	name?: string
	priceConditionIds?: string[]
	categoryIds?: number[]
	themeIds?: number[]
	paginationQuery: PaginationQueryDto
}
