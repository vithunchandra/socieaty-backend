import { ArrayType, Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from '../../../../database/model/base/Base.entity'
import { RestaurantEntity } from './Restaurant.entity'

@Entity({ tableName: 'reservation_configs' })
export class ReservationConfigEntity extends BaseEntity {
	@Property()
	maxPerson: number

	@Property()
	minCostPerPerson: number

	@Property()
	timeLimit: number

	@Property({ type: ArrayType })
	facilities: string[]

	@OneToOne(() => RestaurantEntity)
	restaurant: RestaurantEntity

	constructor(
		maxPerson: number,
		minCostPerPerson: number,
		timeLimit: number,
		facilities: string[]
	) {
		super()
		this.maxPerson = maxPerson
		this.minCostPerPerson = minCostPerPerson
		this.timeLimit = timeLimit
		this.facilities = facilities
	}
}

//buat saja schedule secera otomatis yang mana mempunyai interval sesuai dengan timeLimit dan jam buka restaurant
//untuk total seats tidak perlu berikan tanggung jawab itu ke restaurant. mereka yang atur.
//jadi jumlah seats itu dynamic dan dari total jumlah pesanan pada jadwal tersebut.
