import { ArrayType, Collection, Entity, ManyToMany, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { RestaurantEntity } from './Restaurant.entity'
import { ReservationFacilityEntity } from './reservation-facility.entity'

@Entity({ tableName: 'reservation_configs' })
export class ReservationConfigEntity extends BaseEntity {
	@Property()
	maxPerson: number

	@Property()
	minCostPerPerson: number

	@Property()
	timeLimit: number

	@ManyToMany({
		entity: () => ReservationFacilityEntity,
		mappedBy: 'reservationConfigs',
		fieldName: 'reservation_config_id'
	})
	facilities = new Collection<ReservationFacilityEntity>(this)

	@OneToOne(() => RestaurantEntity)
	restaurant: RestaurantEntity

	constructor(
		maxPerson: number,
		minCostPerPerson: number,
		timeLimit: number,
	) {
		super()
		this.maxPerson = maxPerson
		this.minCostPerPerson = minCostPerPerson
		this.timeLimit = timeLimit
	}
}

//buat saja schedule secera otomatis yang mana mempunyai interval sesuai dengan timeLimit dan jam buka restaurant
//untuk total seats tidak perlu berikan tanggung jawab itu ke restaurant. mereka yang atur.
//jadi jumlah seats itu dynamic dan dari total jumlah pesanan pada jadwal tersebut.
