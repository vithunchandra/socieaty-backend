import { ReservationConfigEntity } from '../persistence/entity/reservation-config.entity'
import { ReservationConfig } from './reservation-config'

export class ReservationConfigMapper {
	static toDomain(raw: ReservationConfigEntity | null): ReservationConfig | null {
		if (!raw) {
			return null
		}
		const config = new ReservationConfig()
		config.id = raw.id
		config.restaurantId = raw.restaurant.id
		config.maxPerson = raw.maxPerson
		config.minCostPerPerson = raw.minCostPerPerson
		config.timeLimit = raw.timeLimit
		config.facilities = raw.facilities.map((facility) => facility.name)
		return config
	}
}
