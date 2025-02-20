import { BadRequestException, Injectable } from '@nestjs/common'
import { RestaurantDaoService } from 'src/modules/restaurant/persistence/Restaurant.dao.service'
import { UserDaoService } from '../user/persistance/User.dao.service'
import { RestaurantCreateDto } from '../auth/dto/RestaurantCreate.dto'
import { UserMapper } from '../user/domain/user.mapper'
import { PaginateRestaurantRequestDto } from './dto/paginate_restaurant_request.dto'
import { PaginationDto } from '../../dto/pagination.dto'
import { RestaurantThemeMapper } from './domain/restaurant-theme.mapper'

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

	async paginateRestaurant(query: PaginateRestaurantRequestDto) {
		const { items, count } = await this.restaurantDao.paginateRestaurant(query)
		const pagination = new PaginationDto()
		pagination.nextOffset = items.length + query.offset
		pagination.previousOffset = query.offset - query.limit
		pagination.hasNext = pagination.nextOffset < count
		pagination.hasPrevious = pagination.previousOffset >= 0
		pagination.count = count
		return {
			restaurants: items.map((item) => UserMapper.fromRestaurantToDomain(item)),
			pagination
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

	async getAllRestaurantThemes() {
		const themes = await this.restaurantDao.getAllRestaurantThemes()
		return {
			themes: themes.map((theme) => RestaurantThemeMapper.toDomain(theme))
		}
	}
}
