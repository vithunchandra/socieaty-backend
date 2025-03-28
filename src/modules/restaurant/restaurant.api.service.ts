import { BadRequestException, Injectable } from '@nestjs/common'
import { RestaurantDaoService } from 'src/modules/restaurant/persistence/Restaurant.dao.service'
import { UserDaoService } from '../user/persistance/User.dao.service'
import { RestaurantCreateDto } from '../auth/dto/RestaurantCreate.dto'
import { UserMapper } from '../user/domain/user.mapper'
import { PaginateRestaurantRequestDto } from './dto/paginate-restaurant-request.dto'
import { PaginationDto } from '../../dto/pagination.dto'
import { RestaurantThemeMapper } from './domain/restaurant-theme.mapper'
import { CreateReservationConfigRequestDto } from './dto/create-reservation-config_request.dto'
import { RestaurantEntity } from './persistence/entity/Restaurant.entity'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { UpdateReservationConfigRequestDto } from './dto/update-reservation-config-request.dto'
import { ReservationConfigMapper } from './domain/reservation-config.mapper'

@Injectable()
export class RestaurantService {
	constructor(
		private readonly restaurantDao: RestaurantDaoService,
		private readonly userDao: UserDaoService,
		private readonly entityManager: EntityManager
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
			closeTime: `${Math.trunc(data.closeTime / 60)}:${data.closeTime % 60}`,
			isReservationAvailable: false
		})
		return restaurant
	}

	async createReservationConfig(
		restaurant: RestaurantEntity,
		data: CreateReservationConfigRequestDto
	) {
		const isConfigExist = await this.restaurantDao.getReservationConfig(restaurant.id)
		if (isConfigExist) {
			throw new BadRequestException('Config sudah ada')
		}
		const reservationConfig = await this.restaurantDao.createReservationConfig({
			restaurantId: restaurant.id,
			maxPerson: data.maxPerson,
			minCostPerPerson: data.minCostPerPerson,
			timeLimit: data.timeLimit
		})
		const reservationFacilities = await this.restaurantDao.createReservationFacility(
			data.facilities
		)
		reservationConfig.facilities.add(reservationFacilities)
		restaurant.isReservationAvailable = true
		await this.entityManager.flush()
		const domainConfig = ReservationConfigMapper.toDomain(reservationConfig)
		console.log(domainConfig)
		return {
			reservationConfig: domainConfig
		}
	}

	async updateReservationConfig(
		restaurant: RestaurantEntity,
		data: UpdateReservationConfigRequestDto
	) {
		const config = await this.restaurantDao.getReservationConfig(restaurant.id)
		if (!config) {
			throw new BadRequestException('Config tidak ditemukan')
		}
		await this.restaurantDao.updateReservationConfig(config, data)
		config.facilities.removeAll()
		const reservationFacilities = await this.restaurantDao.createReservationFacility(
			data.facilities
		)
		config.facilities.add(reservationFacilities)
		await this.entityManager.flush()
		const updatedConfig = await this.entityManager.refresh(config)
		return {
			updatedConfig: ReservationConfigMapper.toDomain(updatedConfig)
		}
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

	async getReservationConfig(restaurantId: string) {
		const config = await this.restaurantDao.getReservationConfig(restaurantId)
		return {
			reservationConfig: ReservationConfigMapper.toDomain(config)
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

	async getRestaurantFacilitiesByNameLike(name: string) {
		const facilities = await this.restaurantDao.getReservationFacilityByNameLike(name)
		return {
			facilities: facilities.map((facility) => facility.name)
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
