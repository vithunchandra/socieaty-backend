import { RestaurantEntity } from '../../../restaurant/persistence/entity/restaurant.entity'

export class CreateFoodMenuDto {
	name: string
	price: number
	description: string
	menuPictureUrl: string
	estimatedTime: number
	categories: number[]
	restaurant: RestaurantEntity
}
