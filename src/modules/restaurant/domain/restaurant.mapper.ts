import { RestaurantEntity } from '../persistence/Restaurant.entity'
import { Restaurant } from './Restaurant'
import { RestaurantThemeMapper } from './restaurant-theme.mapper'

export class RestaurantMapper {
	static toDomain(raw: RestaurantEntity | null): Restaurant | null {
		if (!raw) return null

		const restaurant = new Restaurant()
		restaurant.restaurantBannerUrl = raw.restaurantBannerUrl
		restaurant.location = raw.location
		restaurant.themes = raw.themes
			.map((theme) => RestaurantThemeMapper.toDomain(theme))
			.filter((element) => element !== null && element !== undefined)
		restaurant.payoutBank = raw.payoutBank
		restaurant.accountNumber = raw.accountNumber

		return restaurant
	}
}
