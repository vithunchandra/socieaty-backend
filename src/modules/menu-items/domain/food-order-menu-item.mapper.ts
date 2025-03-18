import { FoodMenuMapper } from '../../food-menu/domain/food-menu.mapper'
import { MenuItemEntity } from '../persistence/menu-item.entity'
import { MenuItem } from './food-order-menu-item'

export class MenuItemMapper {
	static toDomain(raw: MenuItemEntity): MenuItem {
		const foodOrderMenuItem = new MenuItem()
		foodOrderMenuItem.id = raw.id
		foodOrderMenuItem.menu = FoodMenuMapper.toDomain(raw.menu)!
		foodOrderMenuItem.quantity = raw.quantity
		foodOrderMenuItem.price = raw.price
		foodOrderMenuItem.totalPrice = raw.totalPrice
		return foodOrderMenuItem
	}
}
