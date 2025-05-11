import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { RestaurantEntity } from '../restaurant/persistence/entity/restaurant.entity'
import { CreateFoodMenuRequestDto } from './dto/create-food-menu-request.dto'
import { UpdateFoodMenuRequestDto } from './dto/update-food-menu-request.dto'
import { FoodMenuDaoService } from './persistence/food-menu.dao.service'
import { FoodMenuMapper } from './domain/food-menu.mapper'
import { EntityManager } from '@mikro-orm/postgresql'
import { MenuCategoryMapper } from './domain/menu-category.mapper'
import { unlink } from 'fs'
import { GetAllFoodMenuQueryDto } from './dto/get-all-food-menu-query.dto'
import { PaginateMenuDto } from './persistence/dto/paginate-menu.dto'
import { PaginationDto } from '../../dto/pagination.dto'

@Injectable()
export class FoodMenuService {
	constructor(
		private readonly foodMenuDaoService: FoodMenuDaoService,
		private readonly em: EntityManager
	) {}

	async createMenu(
		restaurant: RestaurantEntity | null,
		menuPicture: Express.Multer.File,
		data: CreateFoodMenuRequestDto
	) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.foodMenuDaoService.createMenu({
			...data,
			menuPictureUrl: `files/menu/${menuPicture.filename}`,
			restaurant: restaurant
		})

		await this.em.flush()

		const menuMapped = FoodMenuMapper.toDomain(menu)
		return {
			menu: menuMapped
		}
	}

	async updateMenu(
		restaurant: RestaurantEntity | null,
		menuId: string,
		data: UpdateFoodMenuRequestDto,
		menuPicture?: Express.Multer.File
	) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.foodMenuDaoService.findMenuById(menuId)
		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}

		if (menuPicture) {
			if (!menu.pictureUrl.includes('dummy')) {
				unlink(`src/${menu.pictureUrl}`, (err) => {
					if (err) throw new BadRequestException('Error deleting menu picture')
				})
			}
		}

		await this.foodMenuDaoService.updateMenu(menu, {
			...data,
			menuPictureUrl: menuPicture ? `files/menu/${menuPicture.filename}` : menu.pictureUrl
		})

		await this.em.flush()

		const updatedMenu = await this.foodMenuDaoService.findMenuById(menuId)
		const menuMapped = FoodMenuMapper.toDomain(updatedMenu)
		return {
			menu: menuMapped
		}
	}

	async updateMenuStockAvailablity(
		restaurant: RestaurantEntity | null,
		menuId: string,
		isAvailable: boolean
	) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}

		const menu = await this.foodMenuDaoService.findMenuById(menuId)

		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}

		this.foodMenuDaoService.updateMenuStockAvailablity(menu, isAvailable)
		await this.em.flush()
		const updatedMenu = await this.foodMenuDaoService.findMenuById(menuId)

		return {
			updatedMenu: FoodMenuMapper.toDomain(updatedMenu)
		}
	}

	async findMenuById(menuId: string) {
		const menu = await this.foodMenuDaoService.findMenuById(menuId)
		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		return {
			menu: FoodMenuMapper.toDomain(menu)
		}
	}

	async removeMenu(restaurant: RestaurantEntity | null, menuId: string) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.foodMenuDaoService.findMenuById(menuId)
		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}
		this.foodMenuDaoService.removeMenu(menu)
		await this.em.flush()
		return {
			message: 'Menu removed successfully'
		}
	}

	async findAllMenusByRestaurantId(restaurantId: string, query: GetAllFoodMenuQueryDto) {
		const menus = await this.foodMenuDaoService.findMenusByRestaurantId(restaurantId, query)
		const menusMapped = menus
			.map((menu) => FoodMenuMapper.toDomain(menu))
			.filter((menu) => menu !== null)

		return {
			menus: menusMapped
		}
	}

	async getAllMenuCategories() {
		const categories = await this.foodMenuDaoService.getAllMenuCategories()
		return {
			categories: categories.map((category) => MenuCategoryMapper.toDomain(category))
		}
	}

	async getMenuCategoriesOrderByPopularity() {
		const categories = await this.foodMenuDaoService.getMenuCategoriesOrderByPopularity()
		return {
			categories: categories.map((category) => MenuCategoryMapper.toDomain(category))
		}
	}

	async paginateMenu(query: PaginateMenuDto) {
		const { items, count } = await this.foodMenuDaoService.paginateMenu(query)
		const pagination = new PaginationDto()
		pagination.nextPage = items.length + query.offset
		pagination.previousPage = query.offset - query.limit
		pagination.hasNext = pagination.nextPage < count
		pagination.hasPrevious = pagination.previousPage >= 0
		pagination.count = count
		return {
			menus: items.map((menu) => FoodMenuMapper.toDomain(menu)),
			pagination: pagination
		}
	}
}
