import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import { BankEnum } from '../../../enums/bank.enum'
import { RestaurantEntity } from '../../restaurant/persistence/entity/restaurant.entity'
import { BaseEntity } from '../../../database/model/base/Base.entity'

@Entity({ tableName: 'withdraws' })
export class WithdrawEntity extends BaseEntity {
	@Property()
	amount: number

	@Property()
	status: string

	@Enum(() => BankEnum)
	bank: BankEnum

	@Property()
	accountNumber: string

	@Property()
	referenceNo: string

	@ManyToOne({
		entity: () => RestaurantEntity
	})
	restaurant: RestaurantEntity
}
