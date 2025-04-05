import {
	TransactionServiceType,
	TransactionStatus
} from '../../../enums/transaction.enum'
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

export class Transaction extends BaseTransaction {}
