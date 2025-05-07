import { FoodOrderMapper } from '../../food-order-transaction/domain/food-order.mapper'
import { ReservationMapper } from '../../reservation/domain/reservation.mapper'
import { UserMapper } from '../../user/domain/user.mapper'
import { TransactionEntity } from '../persistence/transaction.entity'
import { Transaction } from './transaction'

export class TransactionMapper {
	static toDomain(raw: TransactionEntity | null): Transaction | null {
		if (!raw) return null

		const transaction = new Transaction()
		transaction.transactionId = raw.id
		transaction.serviceType = raw.serviceType
		transaction.grossAmount = raw.grossAmount
		transaction.serviceFee = raw.serviceFee
		transaction.netAmount = raw.netAmount
		transaction.refundAmount = raw.refundAmount
		transaction.restaurant = UserMapper.fromRestaurantToDomain(raw.restaurant)
		transaction.customer = UserMapper.fromCustomerToDomain(raw.customer)
		transaction.status = raw.status
		transaction.note = raw.note
		transaction.finishedAt = raw.finishedAt
		transaction.reservationData = ReservationMapper.toDomain(raw.reservation)
		transaction.foodOrderData = FoodOrderMapper.toDomain(raw.foodOrder)
		return transaction
	}
}
