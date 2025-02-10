import { Injectable } from '@nestjs/common'
import { RestaurantMenuEntity } from './restaurant-menu.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateRestaurantMenuDto } from './dto/create-restaurant-menu.dto'
import { MenuCategoryEntity } from './menu-category.entity'
import { UpdateRestaurantMenuDto } from './dto/update-restaurant-menu.dto'

@Injectable()
export class RestaurantMenuDaoService {
	constructor(
		@InjectRepository(RestaurantMenuEntity)
		private readonly restaurantMenuRepository: EntityRepository<RestaurantMenuEntity>,
		@InjectRepository(MenuCategoryEntity)
		private readonly menuCategoryRepository: EntityRepository<MenuCategoryEntity>
	) {}

	async createMenu(data: CreateRestaurantMenuDto) {
		const menu = this.restaurantMenuRepository.create({
			restaurant: data.restaurant,
			name: data.name,
			price: data.price,
			description: data.description,
			pictureUrl: data.menuPictureUrl,
			estimatedTime: data.estimatedTime,
			isStockAvailable: true
		})
		const menuCategories = await this.getMenuCategories(data.categories)
		menu.categories.add(menuCategories)
		return menu
	}

	async updateMenu(menu: RestaurantMenuEntity, data: UpdateRestaurantMenuDto) {
		menu.name = data.name
		menu.price = data.price
		menu.description = data.description
		menu.pictureUrl = data.menuPictureUrl
		menu.estimatedTime = data.estimatedTime
		menu.categories.removeAll()
		const menuCategories = await this.getMenuCategories(data.categories)
		menu.categories.add(menuCategories)
		return menu
	}

	async updateMenuStockAvailablity(menu: RestaurantMenuEntity, isAvailable: boolean) {
		if (menu.isStockAvailable !== isAvailable) {
			menu.isStockAvailable = isAvailable
		}
		return isAvailable
	}

	async findMenuById(id: string) {
		return await this.restaurantMenuRepository.findOne({ id: id }, { populate: ['categories'] })
	}

	async findMenusByRestaurantId(restaurantId: string) {
		console.log(restaurantId)
		return await this.restaurantMenuRepository.find(
			{
				restaurant: {
					id: restaurantId
				}
			},
			{ populate: ['restaurant', 'categories'] }
		)
	}

	removeMenu(menu: RestaurantMenuEntity) {
		menu.deletedAt = new Date()
		return menu
	}

	async getAllMenuCategories() {
		return await this.menuCategoryRepository.findAll()
	}

	async getMenuCategories(ids: number[]) {
		const menuCategories: MenuCategoryEntity[] = []
		for (const id of ids) {
			const menuCategory = await this.getMenuCategory(id)
			if (menuCategory) {
				menuCategories.push(menuCategory)
			}
		}
		return menuCategories
	}

	async getMenuCategory(id: number) {
		return await this.menuCategoryRepository.findOne({ id: id })
	}
}
