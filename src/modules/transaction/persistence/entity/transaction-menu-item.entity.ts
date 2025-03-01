import { Entity, Index, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { TransactionEntity } from './transaction.entity'

import { FoodMenuEntity } from '../../../food-menu/persistence/food-menu.entity'
import { BaseEntity } from '../../../../database/model/base/Base.entity'

@Entity({ tableName: 'transaction_menu_items' })
export class TransactionMenuItemEntity extends BaseEntity {
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
		entity: () => TransactionEntity,
		fieldName: 'transaction_id',
	})
	transaction: TransactionEntity

	constructor(menu: FoodMenuEntity, transaction: TransactionEntity, quantity: number) {
		super()
		this.menu = menu
		this.transaction = transaction
		this.quantity = quantity
		this.price = menu.price
		this.totalPrice = menu.price * quantity
	}
}
