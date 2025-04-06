import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { FraudStatus, PaymentStatus } from '../../../enums/topup.enum'
import { Transform } from 'class-transformer'
import { fieldToDate, fieldToFraudStatus, fieldToNumber, fieldToPaymentStatus, fieldToString } from '../../../utils/request_field_transformer.util'

export class TopupNotificationRequestDto {
	@IsString()
	@Transform((data) => fieldToString(data))
	signature_key: string

    @IsString()
    @Transform((data) => fieldToString(data))
    order_id: string

    @IsNotEmpty()
    @Transform((data) => fieldToNumber(data))
    status_code: number

    @IsNotEmpty()
	@Transform((data) => fieldToDate(data))
	transaction_time: Date

	@IsString()
	@Transform((data) => fieldToString(data))
	payment_type: string

    @IsNotEmpty()
    @Transform((data) => fieldToPaymentStatus(data))
	transaction_status: string

    @IsString()
    @Transform((data) => fieldToString(data))
    transaction_id: string

    @IsOptional()
    @IsString()
    @Transform((data) => fieldToFraudStatus(data))
    fraud_status?: FraudStatus

    @IsNotEmpty()
    @Transform((data) => fieldToNumber(data))
    gross_amount: number

    @IsOptional()
    @Transform((data) => fieldToDate(data))
    settlement_time?: Date
}
