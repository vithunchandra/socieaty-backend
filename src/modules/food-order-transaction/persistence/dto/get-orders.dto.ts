import { FoodOrderSortBy, FoodOrderStatus } from "../../../../enums/food-order.enum"
import { SortOrder } from "../../../../enums/sort-order.enum"

export class GetOrdersDto {
    customerId?: string
	restaurantId?: string
	createdAt?: Date
	finishedAt?: Date
	reservationTime?: Date
	status: FoodOrderStatus[]
	sortBy?: FoodOrderSortBy
	sortOrder?: SortOrder
}
