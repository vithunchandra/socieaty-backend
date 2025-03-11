import { Collection, Entity, Enum, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { FoodOrderMenuItemEntity } from './food-order-menu-item.entity'
import { FoodOrderStatus } from '../../../../enums/transaction.enum'
import { TransactionEntity } from '../../../transaction/persistence/transaction.entity'
import { CreateFoodOrderTransactionDto } from '../dto/create-food-order-transaction.dto'

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
		entity: () => FoodOrderMenuItemEntity,
		mappedBy: 'foodOrder'
	})
	menuItems = new Collection<FoodOrderMenuItemEntity>(this)

	constructor(transaction: TransactionEntity, status: FoodOrderStatus) {
		super()
		this.transaction = transaction
		this.status = status
	}
}
