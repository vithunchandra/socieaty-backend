import { IsNotEmpty, IsString } from "class-validator";

class GiveRestaurantAccountEligibilityRequestDto {
	@IsString()
	@IsNotEmpty()
	restaurantId: string
}