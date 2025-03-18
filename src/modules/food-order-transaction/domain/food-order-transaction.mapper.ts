import { MenuItemMapper } from '../../menu-items/domain/food-order-menu-item.mapper'
import { UserMapper } from '../../user/domain/user.mapper'
import { FoodOrderEntity } from '../persistence/entity/food-order-transaction.entity'
import { FoodOrderTransaction } from './food-order-transaction'

export class FoodOrderTransactionMapper {
	static toDomain(raw: FoodOrderEntity | null): FoodOrderTransaction | null {
		if (!raw) return null
		const foodOrderTransaction = new FoodOrderTransaction()
		foodOrderTransaction.transactionId = raw.transaction.id
		foodOrderTransaction.serviceType = raw.transaction.serviceType
		foodOrderTransaction.grossAmount = raw.transaction.grossAmount
		foodOrderTransaction.serviceFee = raw.transaction.serviceFee
		foodOrderTransaction.note = raw.transaction.note
		foodOrderTransaction.status = raw.transaction.status
		foodOrderTransaction.finishedAt = raw.transaction.finishedAt
		foodOrderTransaction.createdAt = raw.transaction.createdAt
		foodOrderTransaction.updatedAt = raw.transaction.updatedAt
		foodOrderTransaction.restaurant = UserMapper.fromRestaurantToDomain(
			raw.transaction.restaurant
		)
		foodOrderTransaction.customer = UserMapper.fromCustomerToDomain(raw.transaction.customer)
		foodOrderTransaction.menuItems = raw.menuItems.map((item) => MenuItemMapper.toDomain(item))
		foodOrderTransaction.foodOrderStatus = raw.status
		foodOrderTransaction.orderId = raw.id
		return foodOrderTransaction
	}
}
