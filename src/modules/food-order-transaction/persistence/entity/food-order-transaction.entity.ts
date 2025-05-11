import { Collection, Entity, Enum, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../../database/model/base/base.entity'
import { MenuItemEntity } from '../../../menu-items/persistence/menu-item.entity'
import { TransactionEntity } from '../../../transaction/persistence/transaction.entity'
import { CreateFoodOrderTransactionDto } from '../dto/create-food-order-transaction.dto'
import { FoodOrderStatus } from '../../../../enums/food-order.enum'

@Entity({ tableName: 'food_orders' })
export class FoodOrderEntity extends BaseEntity {
	@OneToOne({
		entity: () => TransactionEntity,
		inversedBy: 'foodOrder'
	})
	transaction: TransactionEntity

	@Enum(() => FoodOrderStatus)
	status: FoodOrderStatus

	@OneToMany({
		entity: () => MenuItemEntity,
		mappedBy: 'foodOrder'
	})
	menuItems = new Collection<MenuItemEntity>(this)

	constructor(transaction: TransactionEntity, status: FoodOrderStatus) {
		super()
		this.transaction = transaction
		this.status = status
	}
}
