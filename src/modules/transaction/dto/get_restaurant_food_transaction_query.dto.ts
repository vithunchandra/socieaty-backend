import { Enum } from '@mikro-orm/core'
import { TransactionStatus } from '../../../enums/transaction.enum'
import { IsArray, IsEnum } from 'class-validator'

export class GetRestaurantFoodTransactionQueryDto {
	status: TransactionStatus[]
}
