import { IsEnum, IsNotEmpty } from 'class-validator'
import { RestaurantVerificationStatus } from '../../../enums/restaurant-verification-status.enum'
import { Transform } from 'class-transformer'
import { fieldToRestaurantVerificationStatus } from '../../../utils/request_field_transformer.util'

export class UpdateRestaurantVerificationStatusRequestDto {
	@IsNotEmpty()
	@Transform((value) => fieldToRestaurantVerificationStatus(value))
	status: RestaurantVerificationStatus
}
