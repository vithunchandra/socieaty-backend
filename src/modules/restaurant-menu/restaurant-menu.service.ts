import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { RestaurantEntity } from '../restaurant/persistence/Restaurant.entity'
import { CreateRestaurantMenuRequestDto } from './dto/create-restaurant-menu-request.dto'
import { UpdateRestaurantMenuRequestDto } from './dto/update-restaurant-menu-request.dto'
import { RestaurantMenuDaoService } from './persistence/restaurant-menu.dao.service'
import { RestaurantMenuMapper } from './domain/restaurant-menu.mapper'
import { EntityManager } from '@mikro-orm/postgresql'
import { MenuCategoryMapper } from './domain/menu-category.mapper'
import { fstat, unlink } from 'fs'

@Injectable()
export class RestaurantMenuService {
	constructor(
		private readonly restaurantMenuDaoService: RestaurantMenuDaoService,
		private readonly em: EntityManager
	) {}

	async createMenu(
		restaurant: RestaurantEntity | null,
		menuPicture: Express.Multer.File,
		data: CreateRestaurantMenuRequestDto
	) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.restaurantMenuDaoService.createMenu({
			...data,
			menuPictureUrl: `files/menu/${menuPicture.filename}`,
			restaurant: restaurant
		})

		await this.em.flush()

		const menuMapped = RestaurantMenuMapper.toDomain(menu)
		return {
			menu: menuMapped
		}
	}

	async updateMenu(
		restaurant: RestaurantEntity | null,
		menuId: string,
		data: UpdateRestaurantMenuRequestDto,
		menuPicture?: Express.Multer.File
	) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.restaurantMenuDaoService.findMenuById(menuId)
		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}

		if (menuPicture) {
			unlink(`src/${menu.pictureUrl}`, (err) => {
				if (err) throw new BadRequestException('Error deleting menu picture')
				console.log('Menu picture deleted')
			})
		}

		await this.restaurantMenuDaoService.updateMenu(menu, {
			...data,
			menuPictureUrl: menuPicture ? `files/menu/${menuPicture.filename}` : menu.pictureUrl
		})

		await this.em.flush()

		const updatedMenu = await this.restaurantMenuDaoService.findMenuById(menuId)
		const menuMapped = RestaurantMenuMapper.toDomain(updatedMenu)
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

		const menu = await this.restaurantMenuDaoService.findMenuById(menuId)

		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}
		console.log(isAvailable)

		this.restaurantMenuDaoService.updateMenuStockAvailablity(menu, isAvailable)
		await this.em.flush()
		const updatedMenu = await this.restaurantMenuDaoService.findMenuById(menuId)

		return {
			updatedMenu: RestaurantMenuMapper.toDomain(updatedMenu)
		}
	}

	async removeMenu(restaurant: RestaurantEntity | null, menuId: string) {
		if (!restaurant) {
			throw new BadRequestException('Unauthorized Request')
		}
		const menu = await this.restaurantMenuDaoService.findMenuById(menuId)
		if (!menu) {
			throw new NotFoundException('Menu not found')
		}
		if (menu.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Unauthorized Request')
		}
		this.restaurantMenuDaoService.removeMenu(menu)
		await this.em.flush()
		return {
			message: 'Menu removed successfully'
		}

	}

	async findAllMenusByRestaurantId(restaurantId: string) {
		const menus = await this.restaurantMenuDaoService.findMenusByRestaurantId(restaurantId)
		const menusMapped = menus
			.map((menu) => RestaurantMenuMapper.toDomain(menu))
			.filter((menu) => menu !== null)
		return {
			menus: menusMapped
		}
	}

	async getAllMenuCategories() {
		const categories = await this.restaurantMenuDaoService.getAllMenuCategories()
		return {
			categories: categories.map((category) => MenuCategoryMapper.toDomain(category))
		}
	}
}
