import { TransactionServiceType, TransactionStatus } from '../../../enums/transaction.enum'
import { FoodOrder } from '../../food-order-transaction/domain/food-order'
import { Reservation } from '../../reservation/domain/reservation'
import { User } from '../../user/domain/User'

export abstract class BaseTransaction {
	transactionId: string
	serviceType: TransactionServiceType
	grossAmount: number
	netAmount: number
	refundAmount: number
	serviceFee: number
	note: string
	status: TransactionStatus
	restaurant: User
	customer: User
	createdAt: Date
	updatedAt: Date
	finishedAt: Date | null
}

export class Transaction {
	transactionId: string
	serviceType: TransactionServiceType
	grossAmount: number
	netAmount: number
	refundAmount: number
	serviceFee: number
	note: string
	status: TransactionStatus
	restaurant: User
	customer: User
	createdAt: Date
	updatedAt: Date
	finishedAt: Date | null
	reservationData: Reservation | null
	foodOrderData: FoodOrder | null
}
