import { FoodOrderStatus } from '../../../enums/transaction.enum'
import { BaseTransaction } from '../../transaction/domain/transaction'
import { FoodOrderMenuItem } from './food-order-menu-item'

export class FoodOrderTransaction extends BaseTransaction {
	orderId: string
	foodOrderStatus: FoodOrderStatus
	menuItems: FoodOrderMenuItem[]
}
