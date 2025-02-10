import { RestaurantEntity } from '../../../restaurant/persistence/Restaurant.entity'

export class CreateRestaurantMenuDto {
	name: string
	price: number
	description: string
	menuPictureUrl: string
	estimatedTime: number
	categories: number[]
	restaurant: RestaurantEntity
}
