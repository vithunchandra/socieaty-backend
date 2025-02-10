import { MenuCategory } from './menu-category'

export class RestaurantMenu {
	id: string
    restaurantId: string
	name: string
	price: number
	description: string
	pictureUrl: string
	estimatedTime: number
	isStockAvailable: boolean
	categories: MenuCategory[]
}
