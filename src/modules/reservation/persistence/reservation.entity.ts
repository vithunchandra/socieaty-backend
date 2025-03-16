import { Entity, Property, ManyToOne, Enum, OneToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/model/base/Base.entity'
import { ReservationStatus } from '../../../enums/reservation.enum'
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { FoodOrderMenuItemEntity } from '../../food-order-transaction/persistence/entity/food-order-menu-item.entity'



@Entity({ tableName: 'reservations' })
export class ReservationEntity extends BaseEntity {
	@Property()
	reservationTime: Date

	@Property({ nullable: true })
	endTime?: Date

	@Property()
	peopleSize: number

	@Enum(() => ReservationStatus)
	status: ReservationStatus = ReservationStatus.PENDING

	@ManyToOne(() => RestaurantEntity)
	restaurant: RestaurantEntity

	@ManyToOne(() => CustomerEntity)
	customer: CustomerEntity

	@OneToMany({
		entity: () => FoodOrderMenuItemEntity,
		mappedBy: 'foodOrder'
	})
	menuItems = new Collection<FoodOrderMenuItemEntity>(this)
}
