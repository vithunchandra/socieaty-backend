import { FoodOrderStatus } from '../../../enums/transaction.enum'
import { FoodOrderMenuItem } from './food-order-menu-item'

export class FoodOrder {
	id: string
	status: FoodOrderStatus
	menuItems: FoodOrderMenuItem[]
}
