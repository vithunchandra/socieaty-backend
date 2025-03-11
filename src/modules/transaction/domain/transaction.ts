import {
	TransactionServiceType,
	FoodOrderStatus,
	TransactionStatus
} from '../../../enums/transaction.enum'
import { User } from '../../user/domain/User'

export abstract class BaseTransaction {
	transactionId: string
	serviceType: TransactionServiceType
	grossAmount: number
	serviceFee: number
	note: string
	status: TransactionStatus
	restaurant: User
	customer: User
}

export class Transaction extends BaseTransaction {}
