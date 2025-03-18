import { FoodOrderStatus } from '../../../enums/transaction.enum'
import { BaseTransaction } from '../../transaction/domain/transaction'
import { MenuItem } from '../../menu-items/domain/food-order-menu-item'

export class FoodOrderTransaction extends BaseTransaction {
	orderId: string
	foodOrderStatus: FoodOrderStatus
	menuItems: MenuItem[]
}
