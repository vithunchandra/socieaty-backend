import {
	Cascade,
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	OneToOne,
	Property,
	Unique
} from '@mikro-orm/core'
import {
	TransactionPaymentType,
	TransactionServiceType,
	TransactionStatus
} from '../../../../enums/transaction.enum'
import { TransactionMenuItemEntity } from './transaction-menu-item.entity'
import { CreateTransactionDto } from '../dto/create-transaction.dto'
import { RestaurantEntity } from '../../../restaurant/persistence/Restaurant.entity'
import { UserEntity } from '../../../user/persistance/User.entity'
import { CustomerEntity } from '../../../customer/persistence/Customer.entity'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { TransactionMessageEntity } from '../../../transaction-message/persistence/transaction-message.entity'
import { RestaurantReviewEntity } from '../../../food-order-review/persistence/restaurant-review.entity'

@Entity({ tableName: 'transactions' })
export class TransactionEntity extends BaseEntity {
	@Enum(() => TransactionServiceType)
	serviceType: TransactionServiceType

	@Property()
	grossAmount: number

	@Property()
	serviceFee: number

	@Enum(() => TransactionStatus)
	status: TransactionStatus

	@Property()
	note: string

	@ManyToOne({
		entity: () => RestaurantEntity,
		fieldName: 'restaurant_id',
		index: true
	})
	restaurant: RestaurantEntity

	@ManyToOne({
		entity: () => CustomerEntity,
		fieldName: 'customer_id',
		index: true
	})
	customer: CustomerEntity

	@OneToMany({
		entity: () => TransactionMenuItemEntity,
		mappedBy: 'transaction'
	})
	menuItems = new Collection<TransactionMenuItemEntity>(this)

	@OneToMany({
		entity: () => TransactionMessageEntity,
		mappedBy: 'transaction',
		orphanRemoval: true
	})
	messages = new Collection<TransactionMessageEntity>(this)

	@OneToOne({
		entity: () => RestaurantReviewEntity,
		mappedBy: 'transaction'
	})
	review: RestaurantReviewEntity

	constructor(dto: CreateTransactionDto) {
		super()
		this.restaurant = dto.restaurant
		this.customer = dto.customer
		this.serviceType = dto.serviceType
		this.grossAmount = dto.grossAmount
		this.serviceFee = dto.serviceFee
	}
}
