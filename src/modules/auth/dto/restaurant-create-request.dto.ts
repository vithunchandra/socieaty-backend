import { Type } from 'class-transformer'
import {
	IsArray,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString,
	ValidateNested
} from 'class-validator'
import { Point } from 'src/modules/restaurant/persistence/custom-type/point-type'
import { UserRole } from 'src/modules/user/persistance/user.entity'
import { BankEnum } from '../../../enums/bank.enum'

export class RestaurantCreateDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	password: string

	@IsNotEmpty()
	@IsString()
	confirmPassword: string

	@IsNotEmpty()
	@IsString()
	phoneNumber: string

	@IsNotEmpty()
	@IsString()
	role: UserRole

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
}
