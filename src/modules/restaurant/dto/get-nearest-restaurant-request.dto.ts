import { Transform, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { fieldToNumber } from "../../../utils/request_field_transformer.util";

export class GetNearestRestaurantRequestDto {
	@IsNotEmpty()
	@Transform((data) => fieldToNumber(data))
	latitude: number

	@IsNotEmpty()
	@Transform((data) => fieldToNumber(data))
	longitude: number

	@IsNotEmpty()
	@Transform((data) => fieldToNumber(data))
	radius: number
}

