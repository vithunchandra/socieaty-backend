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
			accountNumber: data.accountNumber
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
}
