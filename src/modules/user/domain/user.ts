import { Exclude } from 'class-transformer'
import { UserRole } from '../persistance/user.entity'
import { Restaurant } from 'src/modules/restaurant/domain/restaurant'
import { Customer } from 'src/modules/customer/domain/customer'

export class User {
	id: string
	name: string
	email: string
	@Exclude({ toPlainOnly: true })
	password?: string
	phoneNumber: string
	profilePictureUrl: string | null
	role: UserRole
	isDeleted: boolean
	restaurantData: Restaurant | null
	customerData: Customer | null
}
