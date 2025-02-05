import { Injectable } from '@nestjs/common'
import { RestaurantMenuEntity } from './restaurant-menu.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateRestaurantMenuDto } from './dto/create-restaurant-menu.dto'
import { MenuTypeEntity } from './menu-type.entity'
import { UpdateRestaurantMenuDto } from './dto/update-restaurant-menu.dto'

@Injectable()
export class RestaurantMenuDaoService {
	constructor(
		@InjectRepository(RestaurantMenuEntity)
		private readonly restaurantMenuRepository: EntityRepository<RestaurantMenuEntity>,
		@InjectRepository(MenuTypeEntity)
		private readonly menuTypeRepository: EntityRepository<MenuTypeEntity>
	) {}

	async createMenu(data: CreateRestaurantMenuDto) {
		const menu = this.restaurantMenuRepository.create({
			restaurant: data.restaurant,
			name: data.name,
			price: data.price,
			description: data.description,
			menuPictureUrl: data.menuPictureUrl
		})
		const menuTypes = await this.getMenuTypes(data.types)
		menu.types.add(menuTypes)
		return menu
	}

	async updateMenu(
		menu: RestaurantMenuEntity,
		data: UpdateRestaurantMenuDto
	) {
		menu.name = data.name
		menu.price = data.price
		menu.description = data.description
		menu.menuPictureUrl = data.menuPictureUrl
		menu.types.removeAll()
		const menuTypes = await this.getMenuTypes(data.types)
		menu.types.add(menuTypes)
		return menu
	}

	async findMenuById(id: string) {
		return await this.restaurantMenuRepository.findOne({ id: id })
	}

	async findMenusByRestaurantId(restaurantId: string) {
		return await this.restaurantMenuRepository.find({
			restaurant: restaurantId
		})
	}

	async removeMenu(menu: RestaurantMenuEntity) {
		menu.deletedAt = new Date()
		return menu
	}

	async getMenuTypes(ids: string[]) {
		const menuTypes: MenuTypeEntity[] = []
		for (const id of ids) {
			const menuType = await this.getMenuType(id)
			if (menuType) {
				menuTypes.push(menuType)
			}
		}
		return menuTypes
	}

	async getMenuType(id: string) {
		return await this.menuTypeRepository.findOne({ id: id })
	}
}
