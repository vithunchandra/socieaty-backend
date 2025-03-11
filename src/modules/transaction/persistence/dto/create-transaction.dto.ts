import { TransactionServiceType, TransactionStatus } from "../../../../enums/transaction.enum"
import { CustomerEntity } from "../../../customer/persistence/Customer.entity"
import { RestaurantEntity } from "../../../restaurant/persistence/Restaurant.entity"

export class CreateTransactionDto {
	restaurant: RestaurantEntity
	customer: CustomerEntity
	serviceType: TransactionServiceType
	grossAmount: number
	serviceFee: number
	note: string
	status: TransactionStatus
}

