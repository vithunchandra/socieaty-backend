import { FoodOrderStatus } from '../../../enums/food-order.enum'
import { MenuItem } from '../../menu-items/domain/food-order-menu-item'

export class FoodOrder {
	orderId: string
	foodOrderStatus: FoodOrderStatus
	menuItems: MenuItem[]
}
