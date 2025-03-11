import {
	Cascade,
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	OneToOne,
	Property
} from '@mikro-orm/core'
import { TransactionServiceType, TransactionStatus } from '../../../enums/transaction.enum'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { TransactionMessageEntity } from '../../transaction-message/persistence/transaction-message.entity'
import { TransactionReviewEntity } from '../../transaction-review/persistence/transaction-review.entity'
import { FoodOrderEntity } from '../../food-order-transaction/persistence/entity/food-order-transaction.entity'

@Entity({ tableName: 'transactions' })
export class TransactionEntity extends BaseEntity {
	@Enum(() => TransactionServiceType)
	serviceType: TransactionServiceType

	@Property()
	grossAmount: number

	@Property()
	serviceFee: number

	@Property()
	note: string

	@Enum(() => TransactionStatus)
	status: TransactionStatus

	@Property({ nullable: true })
	finishedAt: Date | null

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
		entity: () => TransactionMessageEntity,
		mappedBy: 'transaction',
		orphanRemoval: true
	})
	messages = new Collection<TransactionMessageEntity>(this)

	@OneToOne({
		entity: () => TransactionReviewEntity,
		mappedBy: 'transaction'
	})
	review: TransactionReviewEntity | null

	@OneToOne({
		entity: () => FoodOrderEntity,
		mappedBy: 'transaction'
	})
	foodOrder: FoodOrderEntity | null

	constructor(dto: CreateTransactionDto) {
		super()
		this.restaurant = dto.restaurant
		this.customer = dto.customer
		this.serviceType = dto.serviceType
		this.grossAmount = dto.grossAmount
		this.serviceFee = dto.serviceFee
	}
}
