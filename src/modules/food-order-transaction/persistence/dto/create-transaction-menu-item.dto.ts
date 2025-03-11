import { FoodMenuEntity } from '../../../food-menu/persistence/food-menu.entity'
import { FoodOrderEntity } from '../entity/food-order-transaction.entity'

export class CreateTransactionMenuItemDto {
	foodOrder: FoodOrderEntity
	menu: FoodMenuEntity
	quantity: number
}
