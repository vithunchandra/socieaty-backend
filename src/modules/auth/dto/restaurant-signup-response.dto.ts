import { Restaurant } from "src/modules/restaurant/domain/Restaurant"
import { User } from "src/modules/user/domain/User"

export class RestaurantSignupResponseDto{
    token: string
    user: User
}