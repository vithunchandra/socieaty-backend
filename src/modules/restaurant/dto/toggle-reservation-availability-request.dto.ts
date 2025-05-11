import { Transform, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { fieldToBoolean } from '../../../utils/request_field_transformer.util'

export class ToggleReservationAvailabilityRequestDto {
	@IsNotEmpty()
	@Transform((value) => fieldToBoolean(value))
	value: boolean
}
