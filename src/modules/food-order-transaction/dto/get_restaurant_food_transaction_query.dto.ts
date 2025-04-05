import { Enum } from '@mikro-orm/core'
import { FoodOrderStatus } from '../../../enums/food-order.enum'
import { IsArray, IsEnum } from 'class-validator'

export class GetRestaurantFoodTransactionQueryDto {
	status: FoodOrderStatus[]
}