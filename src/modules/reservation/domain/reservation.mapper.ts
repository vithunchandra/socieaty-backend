import { MenuItemMapper } from '../../menu-items/domain/food-order-menu-item.mapper'
import { ReservationEntity } from '../persistence/reservation.entity'
import { Reservation } from './reservation'

export class ReservationMapper {
	static toDomain(reservation: ReservationEntity | null): Reservation | null {
		if (!reservation) return null

		const reservationDomain = new Reservation()
		reservationDomain.reservationId = reservation.id
		reservationDomain.reservationStatus = reservation.status
		reservationDomain.reservationTime = reservation.reservationTime
		reservationDomain.endTimeEstimation = reservation.endTimeEstimation
		reservationDomain.peopleSize = reservation.peopleSize
		reservationDomain.menuItems = reservation.menuItems.map((item) =>
			MenuItemMapper.toDomain(item)
		)

		return reservationDomain
	}
}
