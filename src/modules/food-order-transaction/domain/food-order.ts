import { FoodOrderStatus } from '../../../enums/transaction.enum'
import { MenuItem } from '../../menu-items/domain/food-order-menu-item'

export class FoodOrder {
	id: string
	status: FoodOrderStatus
	menuItems: MenuItem[]
}
