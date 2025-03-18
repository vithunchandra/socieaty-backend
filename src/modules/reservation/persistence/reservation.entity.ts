import { Entity, Property, ManyToOne, Enum, OneToMany, Collection, OneToOne } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { ReservationStatus } from '../../../enums/reservation.enum'
import { RestaurantEntity } from '../../restaurant/persistence/entity/Restaurant.entity'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { MenuItemEntity } from '../../menu-items/persistence/menu-item.entity'
import { TransactionEntity } from '../../transaction/persistence/transaction.entity'

@Entity({ tableName: 'reservations' })
export class ReservationEntity extends BaseEntity {
	@Property()
	reservationTime: Date

	@Property()
	endTimeEstimation: Date

	@Property()
	peopleSize: number

	@Enum(() => ReservationStatus)
	status: ReservationStatus

	@OneToOne({
		entity: () => TransactionEntity,
		inversedBy: 'reservation',
	})
	transaction: TransactionEntity

	@OneToMany({
		entity: () => MenuItemEntity,
		mappedBy: 'reservation'
	})
	menuItems = new Collection<MenuItemEntity>(this)

	constructor(
		reservationTime: Date,
		peopleSize: number,
		status: ReservationStatus,
		transaction: TransactionEntity,
		endTimeEstimation: Date
	) {
		super()
		this.reservationTime = reservationTime
		this.peopleSize = peopleSize
		this.status = status
		this.transaction = transaction
		this.endTimeEstimation = endTimeEstimation
	}
}
