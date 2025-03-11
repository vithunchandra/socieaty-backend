import { FoodMenuMapper } from '../../food-menu/domain/food-menu.mapper'
import { FoodOrderMenuItemEntity } from '../persistence/entity/food-order-menu-item.entity'
import { FoodOrderMenuItem } from './food-order-menu-item'

export class FoodOrderMenuItemMapper {
	static toDomain(raw: FoodOrderMenuItemEntity): FoodOrderMenuItem {
		const foodOrderMenuItem = new FoodOrderMenuItem()
		foodOrderMenuItem.id = raw.id
		foodOrderMenuItem.menu = FoodMenuMapper.toDomain(raw.menu)!
		foodOrderMenuItem.quantity = raw.quantity
		foodOrderMenuItem.price = raw.price
		foodOrderMenuItem.totalPrice = raw.totalPrice
		return foodOrderMenuItem
	}
}
