import { FoodOrderSortBy } from "../../../enums/food-order.enum"

import { Transform } from "class-transformer"
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator"
import { fieldToDate, fieldToFoodOrderSortBy, fieldToSortOrder, fieldToString } from "../../../utils/request_field_transformer.util"
import { FoodOrderStatus } from "../../../enums/food-order.enum"
import { SortOrder } from "../../../enums/sort-order.enum"

export class GetOrdersRequestQueryDto{
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
	@IsEnum(FoodOrderStatus, { each: true })
	status: FoodOrderStatus[]

	@IsOptional()
	@Transform((data) => fieldToFoodOrderSortBy(data))
	sortBy?: FoodOrderSortBy

	@IsOptional()
	@Transform((data) => fieldToSortOrder(data))
	sortOrder?: SortOrder
}