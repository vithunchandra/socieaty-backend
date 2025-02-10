import { BadRequestException, Injectable } from '@nestjs/common'
import { RestaurantDaoService } from 'src/modules/restaurant/persistence/Restaurant.dao.service'
import { UserDaoService } from '../user/persistance/User.dao.service'
import { RestaurantCreateDto } from '../auth/dto/RestaurantCreate.dto'
import { UserMapper } from '../user/domain/user.mapper'

@Injectable()
export class RestaurantService {
	constructor(
		private readonly restaurantDao: RestaurantDaoService,
		private readonly userDao: UserDaoService
	) {}

	async createRestaurant(
		data: RestaurantCreateDto,
		profilePicture: Express.Multer.File,
		restaurantBanner: Express.Multer.File
	) {
		const user = this.userDao.create({
			name: data.name,
			email: data.email,
			password: data.password,
			phoneNumber: data.phoneNumber,
			
			profilePictureUrl: `/files/user/profile_picture/${profilePicture.filename}`,
			role: data.role

		})
		const restaurant = this.restaurantDao.create(user, {
			userId: user.id,
			restaurantAddress: data.address,
			restaurantBannerUrl: `/files/user/restaurant_banner/${restaurantBanner.filename}`,
			restaurantThemes: data.themes,
			payoutBank: data.payoutBank,
			accountNumber: data.accountNumber,
			openTime: `${Math.trunc(data.openTime / 60)}:${data.openTime % 60}`,
			closeTime: `${Math.trunc(data.closeTime / 60)}:${data.closeTime % 60}`
		})
		return restaurant
	}

	async getProfile(user_id: string) {
		const user = await this.restaurantDao.getProfile(user_id)
		if (!user) {
			return new BadRequestException('User tidak ditemukan')
		}
		const userMapped = UserMapper.fromRestaurantToDomain(user)
		userMapped.password = undefined
		return {
			user: userMapped
		}
	}

	async getRestaurantById(restaurantId: string) {
		const restaurant = await this.restaurantDao.getRestaurantById(restaurantId)
		if (!restaurant) {
			return new BadRequestException('Restaurant tidak ditemukan')
		}
		const restaurantMapped = UserMapper.fromRestaurantToDomain(restaurant)
		restaurantMapped.password = undefined
		return {
			restaurant: restaurantMapped
		}
	}
}
