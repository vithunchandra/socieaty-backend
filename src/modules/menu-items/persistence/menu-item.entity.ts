import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { FoodMenuEntity } from '../../food-menu/persistence/food-menu.entity'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { FoodOrderEntity } from '../../food-order-transaction/persistence/entity/food-order-transaction.entity'
import { ReservationEntity } from '../../reservation/persistence/reservation.entity'

@Entity({ tableName: 'menu_items' })
export class MenuItemEntity extends BaseEntity {
	@Property()
	quantity: number

	@Property()
	price: number

	@Property()
	totalPrice: number

	@ManyToOne({
		entity: () => FoodMenuEntity,
		fieldName: 'menu_id',
		index: true
	})
	menu: FoodMenuEntity

	@ManyToOne({
		entity: () => FoodOrderEntity,
		fieldName: 'food_order_id'
	})
	foodOrder?: FoodOrderEntity

	@ManyToOne({
		entity: () => ReservationEntity,
		fieldName: 'reservation_id'
	})
	reservation?: ReservationEntity

	constructor(menu: FoodMenuEntity, quantity: number, foodOrder?: FoodOrderEntity, reservation?: ReservationEntity) {
		super()
		this.menu = menu
		this.foodOrder = foodOrder
		this.reservation = reservation
		this.quantity = quantity
		this.price = menu.price
		this.totalPrice = menu.price * quantity
	}
}
