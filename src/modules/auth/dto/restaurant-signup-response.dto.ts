import { Restaurant } from 'src/modules/restaurant/domain/restaurant'
import { User } from 'src/modules/user/domain/user'

export class RestaurantSignupResponseDto {
	token: string
	user: User
}
