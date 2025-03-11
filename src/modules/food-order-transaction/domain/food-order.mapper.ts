import { FoodOrderMenuItemMapper } from './food-order-menu-item.mapper'
import { FoodOrderEntity } from '../persistence/entity/food-order-transaction.entity'
import { FoodOrder } from './food-order'

export class FoodOrderMapper {
	static toDomain(raw: FoodOrderEntity | null): FoodOrder | null {
		if (!raw) return null
		const foodOrderTransaction = new FoodOrder()
		foodOrderTransaction.id = raw.id
		foodOrderTransaction.status = raw.status
		foodOrderTransaction.menuItems = raw.menuItems.map((item) =>
			FoodOrderMenuItemMapper.toDomain(item)
		)
		return foodOrderTransaction
	}
}
