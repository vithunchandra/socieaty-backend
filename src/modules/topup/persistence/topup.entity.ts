import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import { CustomerEntity } from '../../customer/persistence/customer.entity'
import { TopupStatus } from '../../../enums/topup.enum'
import { BaseEntity } from '../../../database/model/base/base.entity'

@Entity({ tableName: 'topups' })
export class TopupEntity extends BaseEntity {
	@Property()
	transactionId?: string

	@Property()
	amount: number

	@Enum(() => TopupStatus)
	status: TopupStatus

	@Property()
	paymentType?: string

	@Property()
	settlementTime?: Date

	@Property()
	snapToken?: string

	@Property()
	snapRedirectUrl?: string

	@ManyToOne({
		entity: () => CustomerEntity
	})
	customer: CustomerEntity
}
