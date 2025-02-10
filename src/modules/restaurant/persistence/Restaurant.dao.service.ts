import { EntityRepository, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserEntity } from '../../user/persistance/User.entity'
import { RestaurantEntity } from './Restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant-dto'
import { RestaurantThemeEntity } from './restaurant-theme.entity'

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
}
