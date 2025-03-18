import { FoodMenuEntity } from '../../../food-menu/persistence/food-menu.entity'
import { FoodOrderEntity } from '../../../food-order-transaction/persistence/entity/food-order-transaction.entity'
import { ReservationEntity } from '../../../reservation/persistence/reservation.entity'

export class CreateMenuItemDto {
	foodOrder?: FoodOrderEntity
	reservation?: ReservationEntity
	menu: FoodMenuEntity
	quantity: number
}
