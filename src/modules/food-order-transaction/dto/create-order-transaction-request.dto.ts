import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { TransactionServiceType } from '../../../enums/transaction.enum'
import { Type } from 'class-transformer'

export class CreateFoodOrderTransactionRequestDto {
	@IsString()
	restaurantId: string

	@IsEnum(TransactionServiceType)
	serviceType: TransactionServiceType

	@IsArray()
	@Type(() => OrderMenuItem)
	menuItems: OrderMenuItem[]

	@IsString()
	note: string
}

class OrderMenuItem {
	@IsString()
	menuId: string

	@IsNumber()
	quantity: number
}
