export class PaginateMenuDto {
	restaurantId?: string
	priceConditionIds?: string[]
	minRating?: number
	categoryIds?: number[]
	searchQuery?: string
	offset: number
	limit: number
}
