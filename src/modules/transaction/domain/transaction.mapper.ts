import { UserMapper } from '../../user/domain/user.mapper'
import { FoodOrderMenuItemEntity } from '../../food-order-transaction/persistence/entity/food-order-menu-item.entity'
import { TransactionEntity } from '../persistence/transaction.entity'
import { Transaction } from './transaction'
import { FoodOrderMapper } from '../../food-order-transaction/domain/food-order.mapper'
import { FoodOrderTransaction } from '../../food-order-transaction/domain/food-order-transaction'
import { FoodOrderMenuItemMapper } from '../../food-order-transaction/domain/food-order-menu-item.mapper'

export class TransactionMapper {
	static toDomain(raw: TransactionEntity) {
		const transaction = new Transaction()
		transaction.transactionId = raw.id
		transaction.serviceType = raw.serviceType
		transaction.grossAmount = raw.grossAmount
		transaction.serviceFee = raw.serviceFee
		transaction.restaurant = UserMapper.fromRestaurantToDomain(raw.restaurant)
		transaction.customer = UserMapper.fromCustomerToDomain(raw.customer)
		transaction.status = raw.status
		transaction.note = raw.note
		return transaction
	}

	// static fromTransactiontoFoodOrderTransaction(
	// 	raw: TransactionEntity,
	// ): FoodOrderTransaction {
	// 	const foodOrderTransaction = new FoodOrderTransaction()
	// 	foodOrderTransaction.id = raw.id
	// 	foodOrderTransaction.serviceType = raw.serviceType
	// 	foodOrderTransaction.grossAmount = raw.grossAmount
	// 	foodOrderTransaction.serviceFee = raw.serviceFee
	// 	foodOrderTransaction.note = raw.note
	// 	foodOrderTransaction.restaurant = UserMapper.fromRestaurantToDomain(raw.restaurant)
	// 	foodOrderTransaction.customer = UserMapper.fromCustomerToDomain(raw.customer)
	// 	foodOrderTransaction.menuItems = raw.foodOrder!.menuItems.map(item => TransactionMenuItemMapper.toDomain(item))
	// 	foodOrderTransaction.status = raw.foodOrder!.status
	// 	foodOrderTransaction.orderId = raw.foodOrder!.id
	// 	return foodOrderTransaction
	// }
}
