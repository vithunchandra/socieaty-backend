import { IsString } from 'class-validator'

export class UpdateCustomerProfileRequestDto {
	@IsString()
	profileUserId: string

	@IsString()
	name: string

	@IsString()
	phoneNumber: string

	@IsString()
	bio: string
}
