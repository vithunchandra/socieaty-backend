import { Injectable } from '@nestjs/common'
import { FoodMenuEntity } from './food-menu.entity'
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateFoodMenuDto } from './dto/create-food-menu.dto'
import { MenuCategoryEntity } from './menu-category.entity'
import { UpdateFoodMenuDto } from './dto/update-food-menu.dto'
import { GetAllFoodMenuDto } from './dto/get-all-food-menu.dto'
import { PriceRange } from '../../../enums/price-range.enum'
import { PaginateMenuDto } from './dto/paginate-menu.dto'

@Injectable()
export class FoodMenuDaoService {
	constructor(
		@InjectRepository(FoodMenuEntity)
		private readonly foodMenuRepository: EntityRepository<FoodMenuEntity>,
		@InjectRepository(MenuCategoryEntity)
		private readonly menuCategoryRepository: EntityRepository<MenuCategoryEntity>
	) {}

	async createMenu(data: CreateFoodMenuDto) {
		const menu = this.foodMenuRepository.create({
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

	async updateMenu(menu: FoodMenuEntity, data: UpdateFoodMenuDto) {
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

	async updateMenuStockAvailablity(menu: FoodMenuEntity, isAvailable: boolean) {
		if (menu.isStockAvailable !== isAvailable) {
			menu.isStockAvailable = isAvailable
		}
		return isAvailable
	}

	async findMenuById(id: string) {
		return await this.foodMenuRepository.findOne({ id: id }, { populate: ['categories'] })
	}

	async findMenusByIds(ids: string[]) {
		return await this.foodMenuRepository.find({ id: { $in: ids } }, { populate: ['categories'] })
	}

	async findMenusByRestaurantId(restaurantId: string, query: GetAllFoodMenuDto) {
		const queryObject: FilterQuery<FoodMenuEntity> = {
			restaurant: { id: restaurantId }
		}

		if (query.searchQuery?.trim().length != 0) {
			queryObject.name = {
				$ilike: `%${query.searchQuery}%`
			}
		}

		// Handle price range conditions
		if (query.priceConditionIds?.length) {
			queryObject.$or = query.priceConditionIds.map((id) => {
				return {
					price: {
						$gte: PriceRange[id].minPrice,
						$lte: PriceRange[id].maxPrice
					}
				}
			})
		}

		// Handle category filtering
		if (query.categoryIds?.length) {
			queryObject.categories = {
				$in: query.categoryIds
			}
		}

		return await this.foodMenuRepository.find(queryObject, {
			populate: ['restaurant', 'categories']
		})
	}

	async paginateMenu(query: PaginateMenuDto) {
		const queryObject: FilterQuery<FoodMenuEntity> = {}

		if (query.restaurantId) {
			queryObject.restaurant = { id: query.restaurantId }
		}

		if (query.searchQuery?.trim().length != 0) {
			queryObject.name = {
				$ilike: `%${query.searchQuery}%`
			}
		}

		// Handle price range conditions
		if (query.priceConditionIds?.length) {
			queryObject.$or = query.priceConditionIds.map((id) => {
				return {
					price: {
						$gte: PriceRange[id].minPrice,
						$lte: PriceRange[id].maxPrice
					}
				}
			})
		}

		// Handle category filtering
		if (query.categoryIds?.length) {
			queryObject.categories = {
				$in: query.categoryIds
			}
		}

		const [menus, count] = await this.foodMenuRepository.findAndCount(queryObject, {
			populate: ['restaurant', 'categories'],
			limit: query.limit,
			offset: query.offset
		})
		return {
			items: menus,
			count: count
		}
	}

	removeMenu(menu: FoodMenuEntity) {
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
