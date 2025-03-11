import { FoodOrderStatus } from 'src/enums/transaction.enum'

export class CreateFoodOrderTransactionDto {
	transactionId: string
	status: FoodOrderStatus
}
