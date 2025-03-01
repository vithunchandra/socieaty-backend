import {
	Cascade,
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
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

	constructor(dto: CreateTransactionDto) {
		super()
		this.restaurant = dto.restaurant
		this.customer = dto.customer
		this.serviceType = dto.serviceType
		this.grossAmount = dto.grossAmount
		this.serviceFee = dto.serviceFee
	}
}
