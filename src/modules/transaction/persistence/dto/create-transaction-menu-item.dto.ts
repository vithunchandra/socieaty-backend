import { FoodMenuEntity } from '../../../food-menu/persistence/food-menu.entity'
import { TransactionEntity } from '../entity/transaction.entity'

export class CreateTransactionMenuItemDto {
	transaction: TransactionEntity
	menu: FoodMenuEntity
	quantity: number
}
