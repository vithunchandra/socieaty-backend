import { Restaurant } from "src/modules/restaurant/domain/Restaurant"

export class RestaurantSignupResponseDto{
    token: string
    restaurant: Restaurant
}