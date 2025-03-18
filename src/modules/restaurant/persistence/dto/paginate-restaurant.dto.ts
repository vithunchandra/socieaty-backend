export class PaginateRestaurantDto {
	name?: string
	priceConditionIds?: string[]
	categoryIds?: number[]
	themeIds?: number[]
	offset: number
	limit: number
}
