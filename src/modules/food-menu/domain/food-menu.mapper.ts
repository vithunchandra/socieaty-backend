import { MenuCategory } from './menu-category'
import { MenuCategoryMapper } from './menu-category.mapper'
import { BASE_URL } from '../../../constants'
import { FoodMenuEntity } from '../persistence/food-menu.entity'
import { FoodMenu } from './food-menu'

export class FoodMenuMapper {
	static toDomain(raw: FoodMenuEntity | null): FoodMenu | null {
		if (!raw) return null

		const menu = new FoodMenu()
		menu.id = raw.id
		menu.restaurantId = raw.restaurant.id
		menu.name = raw.name
		menu.price = raw.price
		menu.description = raw.description
		menu.pictureUrl = `${BASE_URL}${raw.pictureUrl.replaceAll('\\', '/')}`
		menu.estimatedTime = raw.estimatedTime
		menu.isStockAvailable = raw.isStockAvailable
		menu.categories = raw.categories
			.map((type) => MenuCategoryMapper.toDomain(type))

			.filter((type) => type !== null)
		return menu
	}
}
