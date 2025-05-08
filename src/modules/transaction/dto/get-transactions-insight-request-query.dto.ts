import { Transform } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { fieldToDate, fieldToString, fieldToTransactionServiceType } from "../../../utils/request_field_transformer.util"
import { TransactionServiceType } from "../../../enums/transaction.enum"

export class GetTransactionsInsightRequestQueryDto {
	@IsString()
	@IsOptional()
	@Transform((data) => fieldToString(data))
	restaurantId?: string

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	rangeStartDate?: Date

	@IsOptional()
	@Transform((data) => fieldToDate(data))
	rangeEndDate?: Date

	@IsOptional()
	@Transform((data) => fieldToTransactionServiceType(data))
	serviceType?: TransactionServiceType
}