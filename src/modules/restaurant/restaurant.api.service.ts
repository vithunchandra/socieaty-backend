import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
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
import { Point } from './persistence/custom-type/PointType'
import { GetNearestRestaurantRequestDto } from './dto/get-nearest-restaurant-request.dto'
import { GetAllUnverifiedRestaurantRequestQueryDto } from './dto/get-all-unverified-restaurant-request-query.dto'
import { UpdateRestaurantVerificationStatusRequestDto } from './dto/update-restaurant-verification-status-request.dto'
import { PROFILE_PICTURE_RELATIVE_DIR, RESTAURANT_BANNER_RELATIVE_DIR } from '../../constants'
import { UpdateRestaurantDataRequestDto } from './dto/update-restaurant-data-request.dto'
import { UserEntity } from '../user/persistance/User.entity'
import { unlink } from 'fs'
import { RestaurantVerificationStatus } from '../../enums/restaurant-verification-status.enum'

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
			profilePictureUrl: `${PROFILE_PICTURE_RELATIVE_DIR}/${profilePicture.filename}`,
			role: data.role
		})
		const restaurant = this.restaurantDao.create(user, {
			userId: user.id,
			restaurantAddress: data.address,
			restaurantBannerUrl: `${RESTAURANT_BANNER_RELATIVE_DIR}/${restaurantBanner.filename}`,
			restaurantThemes: data.themes,
			payoutBank: data.payoutBank,
			accountNumber: data.accountNumber,
			openTime: `${Math.trunc(data.openTime / 60)}:${data.openTime % 60}`,
			closeTime: `${Math.trunc(data.closeTime / 60)}:${data.closeTime % 60}`,
			isReservationAvailable: false
		})
		return restaurant
	}

	async updateRestaurantData(
		restaurantId: string,
		user: UserEntity,
		data: UpdateRestaurantDataRequestDto,
		profilePicture?: Express.Multer.File,
		restaurantBanner?: Express.Multer.File
	) {
		if (user.restaurantData?.id !== restaurantId) {
			throw new ForbiddenException('User tidak memiliki akses untuk mengupdate data ini')
		}
		if (
			user.restaurantData?.verificationStatus === RestaurantVerificationStatus.VERIFIED &&
			data.verificationStatus !== RestaurantVerificationStatus.VERIFIED
		) {
			throw new BadRequestException('Restaurant sudah diverifikasi')
		}

		if (profilePicture) {
			if (!user.profilePictureUrl?.includes('dummy')) {
				unlink(`src/${user.profilePictureUrl}`, (err) => {
					if (err) throw new BadRequestException('Error saat mengupdate profile picture')
				})
			}
		}
		if (restaurantBanner) {
			if (!user.restaurantData?.restaurantBannerUrl?.includes('dummy')) {
				unlink(`src/${user.restaurantData?.restaurantBannerUrl}`, (err) => {
					if (err)
						throw new BadRequestException('Error saat mengupdate restaurant banner')
				})
			}
		}

		this.userDao.update(user, {
			...data,
			profilePictureUrl: profilePicture
				? `${PROFILE_PICTURE_RELATIVE_DIR}/${profilePicture.filename}`
				: (user.profilePictureUrl ?? undefined)
		})

		await this.restaurantDao.updateRestaurantData(user.restaurantData!, {
			restaurantAddress: data.address,
			restaurantBannerUrl: restaurantBanner
				? `${RESTAURANT_BANNER_RELATIVE_DIR}/${restaurantBanner.filename}`
				: (user.restaurantData?.restaurantBannerUrl ?? ''),
			payoutBank: data.payoutBank,
			accountNumber: data.accountNumber,
			openTime: `${Math.trunc(data.openTime / 60)}:${data.openTime % 60}`,
			closeTime: `${Math.trunc(data.closeTime / 60)}:${data.closeTime % 60}`,
			verificationStatus: data.verificationStatus,
			themes: data.themes
		})

		await this.entityManager.flush()
		const updatedRestaurant = await this.restaurantDao.findRestaurantById(
			user.restaurantData!.id,
			true
		)
		return {
			restaurant: UserMapper.fromRestaurantToDomain(updatedRestaurant!)
		}
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

	async toggleReservationAvailability(restaurant: UserEntity, toggleValue: boolean) {
		const reservationConfigExist = await this.restaurantDao.getReservationConfig(
			restaurant.restaurantData!.id
		)
		if (!reservationConfigExist) {
			throw new BadRequestException('Reservation config tidak ditemukan')
		}

		restaurant.restaurantData!.isReservationAvailable = toggleValue
		await this.entityManager.flush()
		const newRestaurant = await this.restaurantDao.findRestaurantById(
			restaurant.restaurantData!.id
		)
		return {
			restaurant: UserMapper.fromRestaurantToDomain(newRestaurant!)
		}
	}

	async getProfile(user_id: string) {
		const user = await this.restaurantDao.getProfile(user_id)
		if (!user) {
			throw new BadRequestException('User tidak ditemukan')
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
		pagination.nextPage = items.length + query.paginationQuery.page
		pagination.previousPage = query.paginationQuery.page - query.paginationQuery.pageSize
		pagination.hasNext = pagination.nextPage < count
		pagination.hasPrevious = pagination.previousPage >= 0
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
		const restaurant = await this.restaurantDao.findRestaurantById(restaurantId)
		if (!restaurant) {
			throw new BadRequestException('Restaurant tidak ditemukan')
		}
		const restaurantMapped = UserMapper.fromRestaurantToDomain(restaurant)
		restaurantMapped.password = undefined
		return {
			restaurant: restaurantMapped
		}
	}

	async getAllUnverifiedRestaurant(query: GetAllUnverifiedRestaurantRequestQueryDto) {
		const restaurants = await this.restaurantDao.findAllUnverifiedRestaurant(query)
		return {
			restaurants: restaurants.map((restaurant) =>
				UserMapper.fromRestaurantToDomain(restaurant)
			)
		}
	}

	async getNearestRestaurant(query: GetNearestRestaurantRequestDto) {
		const point = new Point(query.latitude, query.longitude)
		const restaurants = await this.restaurantDao.getNearestRestaurant(point, query.radius)
		console.log(restaurants.length)
		return {
			restaurants: restaurants.map((restaurant) =>
				UserMapper.fromRestaurantToDomain(restaurant)
			)
		}
	}

	async getAllRestaurantThemes() {
		const themes = await this.restaurantDao.getAllRestaurantThemes()
		return {
			themes: themes.map((theme) => RestaurantThemeMapper.toDomain(theme))
		}
	}

	async updateRestaurantVerificationStatus(
		restaurantId: string,
		data: UpdateRestaurantVerificationStatusRequestDto
	) {
		let restaurant = await this.restaurantDao.findRestaurantById(restaurantId, true)
		if (!restaurant) {
			throw new BadRequestException('Restaurant tidak ditemukan')
		}
		restaurant.verificationStatus = data.status
		await this.entityManager.flush()
		restaurant = await this.entityManager.refresh(restaurant)
		return {
			message: 'Status verifikasi berhasil diubah'
		}
	}
}
