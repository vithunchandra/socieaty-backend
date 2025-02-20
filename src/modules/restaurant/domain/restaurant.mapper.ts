import { BASE_URL } from '../../../constants'
import { RestaurantEntity } from '../persistence/Restaurant.entity'
import { Restaurant } from './Restaurant'
import { RestaurantThemeMapper } from './restaurant-theme.mapper'

export class RestaurantMapper {
	static toDomain(raw: RestaurantEntity | null): Restaurant | null {
		if (!raw) return null
		const openTime = raw.openTime.split(':')
		const closeTime = raw.closeTime.split(':')

		const restaurant = new Restaurant()
		restaurant.id = raw.id
		restaurant.restaurantBannerUrl = `${BASE_URL}${raw.restaurantBannerUrl}`
		restaurant.location = raw.location
		restaurant.themes = raw.themes

			.map((theme) => RestaurantThemeMapper.toDomain(theme))
			.filter((element) => element !== null && element !== undefined)
		restaurant.openTime = `${openTime[0].padStart(2, '0')}:${openTime[1].padStart(2, '0')}`
		restaurant.closeTime = `${closeTime[0].padStart(2, '0')}:${closeTime[1].padStart(2, '0')}`
		restaurant.payoutBank = raw.payoutBank
		restaurant.accountNumber = raw.accountNumber

		return restaurant
	}
}
