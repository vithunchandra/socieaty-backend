import { FoodMenu } from '../../food-menu/domain/food-menu'

export class FoodOrderMenuItem {
	id: string
	menu: FoodMenu
	quantity: number
	price: number
	totalPrice: number
}
