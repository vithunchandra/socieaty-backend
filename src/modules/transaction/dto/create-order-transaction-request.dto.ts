import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator'
import { TransactionServiceType } from '../../../enums/transaction.enum'
import { Type } from 'class-transformer'

export class CreateOrderTransactionRequestDto {
	@IsString()
	restaurantId: string

	@IsEnum(TransactionServiceType)
	serviceType: TransactionServiceType

	@IsArray()
	@Type(() => OrderMenuItem)
	menuItems: OrderMenuItem[]
}

class OrderMenuItem {
	@IsString()
	menuId: string

	@IsNumber()
	quantity: number
}
