import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString,
	ValidateNested
} from 'class-validator'
import { UserRole } from '../../user/persistance/User.entity'
import { Point } from '../persistence/custom-type/PointType'
import { Transform, Type } from 'class-transformer'
import { BankEnum } from '../../../enums/bank.enum'
import { RestaurantVerificationStatus } from '../../../enums/restaurant-verification-status.enum'
import { fieldToRestaurantVerificationStatus } from '../../../utils/request_field_transformer.util'

export class UpdateRestaurantDataRequestDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	phoneNumber: string

	@ValidateNested()
	@Type(() => Point)
	@IsObject()
	address: Point

	@Type(() => Number)
	@IsArray()
	@IsNumber({}, { each: true })
	themes: number[]

	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	openTime: number

	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	closeTime: number

	@IsNotEmpty()
	@IsEnum(BankEnum)
	payoutBank: BankEnum

	@IsNotEmpty()
	@IsString()
	accountNumber: string

	@IsNotEmpty()
	@Transform((value) => fieldToRestaurantVerificationStatus(value))
	verificationStatus: RestaurantVerificationStatus
}
