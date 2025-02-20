import { EntityRepository, FilterQuery, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserEntity } from '../../user/persistance/User.entity'
import { RestaurantEntity } from './Restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant-dto'
import { RestaurantThemeEntity } from './restaurant-theme.entity'
import { PaginateRestaurantDto } from './dto/paginate_restaurant.dto'
import { PriceRange } from '../../../enums/price-range.enum'

@Injectable()
export class RestaurantDaoService {
	constructor(
		@InjectRepository(RestaurantEntity)
		private readonly restaurantRepository: EntityRepository<RestaurantEntity>,
		@InjectRepository(RestaurantThemeEntity)
		private readonly restaurantThemeRepository: EntityRepository<RestaurantThemeEntity>
	) {}

	async create(user: UserEntity, data: CreateRestaurantDto): Promise<RestaurantEntity> {
		const restaurant = this.restaurantRepository.create({
			userData: user,
			location: data.restaurantAddress,
			restaurantBannerUrl: data.restaurantBannerUrl,
			payoutBank: data.payoutBank,
			accountNumber: data.accountNumber,
			openTime: data.openTime,
			closeTime: data.closeTime
		})
		const themes = await this.getRestaurantThemes(data.restaurantThemes)
		restaurant.themes.add(themes)
		return restaurant
	}

	async getProfile(user_id: string): Promise<RestaurantEntity | null> {
		const restaurant = await this.restaurantRepository.findOne(
			{
				userData: { id: user_id }
			},
			{ populate: ['userData.restaurantData', 'themes'] }
		)
		return restaurant
	}

	async paginateRestaurant(query: PaginateRestaurantDto) {
		const { name, offset, limit, priceConditionIds, categoryIds, themeIds } = query
		console.log(query)
		const filter: FilterQuery<RestaurantEntity> = {}
		if (name) {
			filter.userData = { name: { $ilike: `%${name}%` } }
		}
		if (priceConditionIds) {
			filter.menus = {
				$or: priceConditionIds.map((id) => {
					return {
						price: {
							$gte: PriceRange[id].minPrice,
							$lte: PriceRange[id].maxPrice
						}
					}
				})
			}
		}
		if (categoryIds) {
			filter.menus = { categories: { $in: categoryIds } }
		}
		if (themeIds) {
			filter.themes = { id: { $in: themeIds } }
		}
		console.log(filter)
		const [items, count] = await this.restaurantRepository.findAndCount(filter, {
			populate: ['userData.restaurantData', 'themes'],
			offset: offset,
			limit
		})

		console.log(items[0].menus)

		return {
			items,
			count
		}
	}

	async getRestaurantById(restaurantId: string): Promise<RestaurantEntity | null> {
		return await this.restaurantRepository.findOne(
			{
				id: restaurantId
			},
			{ populate: ['userData', 'userData.restaurantData', 'userData.restaurantData.themes'] }
		)
	}

	async getRestaurantThemes(themeIds: number[]): Promise<RestaurantThemeEntity[]> {
		const themes = await this.restaurantThemeRepository.find({
			id: { $in: themeIds }
		})
		return themes
	}

	async getRestaurantTheme(themeId: number): Promise<RestaurantThemeEntity | null> {
		return await this.restaurantThemeRepository.findOne({
			id: themeId
		})
	}

	async getAllRestaurantThemes(): Promise<RestaurantThemeEntity[]> {
		return await this.restaurantThemeRepository.findAll()
	}
}
