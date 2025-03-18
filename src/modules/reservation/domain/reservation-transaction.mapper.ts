import { MenuItemMapper } from '../../menu-items/domain/food-order-menu-item.mapper'
import { UserMapper } from '../../user/domain/user.mapper'
import { ReservationEntity } from '../persistence/reservation.entity'
import { ReservationTransaction } from './reservation-transaction'

export class ReservationTransactionMapper {
	static toDomain(raw: ReservationEntity | null): ReservationTransaction | null {
		if (!raw) return null

		const reservationTransaction = new ReservationTransaction()
		reservationTransaction.transactionId = raw.transaction.id
		reservationTransaction.serviceType = raw.transaction.serviceType
		reservationTransaction.grossAmount = raw.transaction.grossAmount
		reservationTransaction.serviceFee = raw.transaction.serviceFee
		reservationTransaction.note = raw.transaction.note
		reservationTransaction.status = raw.transaction.status
		reservationTransaction.finishedAt = raw.transaction.finishedAt
		reservationTransaction.createdAt = raw.transaction.createdAt
		reservationTransaction.updatedAt = raw.transaction.updatedAt
		reservationTransaction.restaurant = UserMapper.fromRestaurantToDomain(
			raw.transaction.restaurant
		)
		reservationTransaction.customer = UserMapper.fromCustomerToDomain(raw.transaction.customer)
		reservationTransaction.reservationId = raw.id
		reservationTransaction.reservationStatus = raw.status
		reservationTransaction.reservationTime = raw.reservationTime
		reservationTransaction.endTimeEstimation = raw.endTimeEstimation
		reservationTransaction.peopleSize = raw.peopleSize
		reservationTransaction.menuItems = raw.menuItems.map((item) =>
			MenuItemMapper.toDomain(item)
		)
		return reservationTransaction
	}
}
