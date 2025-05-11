import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { RestaurantEntity } from '../../restaurant/persistence/entity/restaurant.entity'
import { TransactionEntity } from '../../transaction/persistence/transaction.entity'
import { CustomerEntity } from '../../customer/persistence/customer.entity'

@Entity({ tableName: 'transaction_reviews' })
export class TransactionReviewEntity extends BaseEntity {
	@Property()
	rating: number

	@Property()
	review: string

	@OneToOne({
		entity: () => TransactionEntity,
		inversedBy: 'review',
		fieldName: 'transaction_id',
		index: true
	})
	transaction: TransactionEntity

	// @ManyToOne({
	// 	entity: () => CustomerEntity,
	// 	inversedBy: 'reviews',
	// 	fieldName: 'user_id',
	// 	index: true
	// })
	// customer: CustomerEntity

	// @ManyToOne({
	// 	entity: () => RestaurantEntity,
	// 	inversedBy: 'reviews',
	// 	fieldName: 'restaurant_id',
	// 	index: true
	// })
	// restaurant: RestaurantEntity

	constructor(transaction: TransactionEntity, rating: number, review: string) {
		super()
		this.transaction = transaction
		this.rating = rating
		this.review = review
	}
}
