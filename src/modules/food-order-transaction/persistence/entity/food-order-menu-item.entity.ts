import { Entity, Index, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { TransactionEntity } from '../../../transaction/persistence/transaction.entity'

import { FoodMenuEntity } from '../../../food-menu/persistence/food-menu.entity'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { FoodOrderEntity } from './food-order-transaction.entity'

@Entity({ tableName: 'food_order_menu_items' })
export class FoodOrderMenuItemEntity extends BaseEntity {
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
	foodOrder: FoodOrderEntity

	constructor(menu: FoodMenuEntity, foodOrder: FoodOrderEntity, quantity: number) {
		super()
		this.menu = menu
		this.foodOrder = foodOrder
		this.quantity = quantity
		this.price = menu.price
		this.totalPrice = menu.price * quantity
	}
}
