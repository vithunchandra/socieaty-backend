import { MenuCategoryEntity } from '../persistence/menu-category.entity'
import { MenuCategory } from './menu-category'

export class MenuCategoryMapper {
	static toDomain(raw: MenuCategoryEntity | null): MenuCategory | null {
		if (!raw) return null

		const menuType = new MenuCategory()
		menuType.id = raw.id
		menuType.name = raw.name

		return menuType
	}
}
