import { FoodOrderStatus } from 'src/enums/food-order.enum'

export class CreateFoodOrderTransactionDto {
	transactionId: string
	status: FoodOrderStatus
}
