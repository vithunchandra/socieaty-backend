import { wrap } from '@mikro-orm/core'
import { UserEntity } from '../persistance/user.entity'
import { User } from './User'
import { CustomerMapper } from 'src/modules/customer/domain/customer.mapper'
import { RestaurantMapper } from 'src/modules/restaurant/domain/restaurant.mapper'
import { CustomerEntity } from 'src/modules/customer/persistence/customer.entity'
import { RestaurantEntity } from 'src/modules/restaurant/persistence/entity/restaurant.entity'
import { BASE_URL } from '../../../constants'

export class UserMapper {
	static toDomain(raw: UserEntity) {
		let profilePictureUrl: string | null = null
		if (raw.profilePictureUrl) {
			profilePictureUrl = `${BASE_URL}${raw.profilePictureUrl}`
		}
		let isDeleted = false
		if (raw.deletedAt) {
			isDeleted = true
		}
		const user = new User()
		user.id = raw.id
		user.name = raw.name
		user.email = raw.email
		user.password = raw.password
		user.phoneNumber = raw.phoneNumber
		user.profilePictureUrl = profilePictureUrl
		user.role = raw.role
		user.customerData = CustomerMapper.toDomain(raw.customerData)
		user.restaurantData = RestaurantMapper.toDomain(raw.restaurantData)
		user.isDeleted = isDeleted
		return user
	}

	static fromCustomerToDomain(raw: CustomerEntity) {
		const user = new User()
		let profilePictureUrl: string | null = null
		if (raw.userData.profilePictureUrl) {
			profilePictureUrl = `${BASE_URL}${raw.userData.profilePictureUrl}`
		}

		const userData = raw.userData

		let isDeleted = false
		if (userData.deletedAt) {
			isDeleted = true
		}
		user.id = userData.id
		user.email = userData.email
		user.name = userData.name
		user.password = userData.password
		user.phoneNumber = userData.phoneNumber
		user.profilePictureUrl = profilePictureUrl
		user.role = userData.role
		user.isDeleted = isDeleted
		user.customerData = CustomerMapper.toDomain(raw)
		user.restaurantData = null

		return user
	}

	static fromRestaurantToDomain(raw: RestaurantEntity) {
		let profilePictureUrl: string | null = null
		if (raw.userData.profilePictureUrl) {
			profilePictureUrl = `${BASE_URL}${raw.userData.profilePictureUrl}`
		}

		const user = new User()
		const userData = raw.userData

		let isDeleted = false
		if (userData.deletedAt) {
			isDeleted = true
		}

		user.id = userData.id
		user.email = userData.email
		user.name = userData.name
		user.password = userData.password
		user.phoneNumber = userData.phoneNumber
		user.profilePictureUrl = profilePictureUrl
		user.role = userData.role
		user.isDeleted = isDeleted
		user.customerData = null
		user.restaurantData = RestaurantMapper.toDomain(raw)

		return user
	}
}
