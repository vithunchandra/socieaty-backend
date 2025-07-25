import { EntityRepository, FilterQuery, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserEntity } from '../../user/persistance/user.entity'
import { RestaurantEntity } from './entity/restaurant.entity'
import { CreateRestaurantDto } from './dto/create-restaurant-dto'
import { RestaurantThemeEntity } from './entity/restaurant-theme.entity'
import { PaginateRestaurantDto } from './dto/paginate-restaurant.dto'
import { PriceRange } from '../../../enums/price-range.enum'
import { CreateReservationConfigDto } from './dto/create-reservation-config.dto'
import { ReservationConfigEntity } from './entity/reservation-config.entity'
import { UpdateReservationConfigRequestDto } from '../dto/update-reservation-config-request.dto'
import { ReservationFacilityEntity } from './entity/reservation-facility.entity'
import { Point } from './custom-type/point-type'
import { RestaurantVerificationStatus } from '../../../enums/restaurant-verification-status.enum'
import { UpdateRestaurantDataRequestDto } from '../dto/update-restaurant-data-request.dto'
import { UpdateRestaurantDataDto } from './dto/update-restaurant-data.dto'

@Injectable()
export class RestaurantDaoService {
	constructor(
		@InjectRepository(RestaurantEntity)
		private readonly restaurantRepository: EntityRepository<RestaurantEntity>,
		@InjectRepository(RestaurantThemeEntity)
		private readonly restaurantThemeRepository: EntityRepository<RestaurantThemeEntity>,
		@InjectRepository(ReservationConfigEntity)
		private readonly reservationConfigRepository: EntityRepository<ReservationConfigEntity>,
		@InjectRepository(ReservationFacilityEntity)
		private readonly reservationFacilityRepository: EntityRepository<ReservationFacilityEntity>
	) {}

	async create(user: UserEntity, data: CreateRestaurantDto): Promise<RestaurantEntity> {
		const restaurant = this.restaurantRepository.create({
			userData: user,
			wallet: 0,
			location: data.restaurantAddress,
			restaurantBannerUrl: data.restaurantBannerUrl,
			payoutBank: data.payoutBank,
			accountNumber: data.accountNumber,
			verificationStatus: RestaurantVerificationStatus.UNVERIFIED,
			openTime: data.openTime,
			closeTime: data.closeTime,
			isReservationAvailable: data.isReservationAvailable
		})
		const themes = await this.getRestaurantThemes(data.restaurantThemes)
		restaurant.themes.add(themes)
		return restaurant
	}

	async createReservationConfig(data: CreateReservationConfigDto) {
		const reservationConfig = this.reservationConfigRepository.create({
			restaurant: data.restaurantId,
			maxPerson: data.maxPerson,
			minCostPerPerson: data.minCostPerPerson,
			timeLimit: data.timeLimit
		})
		return reservationConfig
	}

	async updateRestaurantData(restaurant: RestaurantEntity, data: UpdateRestaurantDataDto) {
		restaurant.location = data.restaurantAddress
		restaurant.restaurantBannerUrl = data.restaurantBannerUrl
		restaurant.payoutBank = data.payoutBank
		restaurant.accountNumber = data.accountNumber
		restaurant.openTime = data.openTime
		restaurant.closeTime = data.closeTime
		restaurant.verificationStatus = data.verificationStatus
		restaurant.themes.removeAll()
		const themes = await this.getRestaurantThemes(data.themes)
		restaurant.themes.add(themes)
		return restaurant
	}

	async updateReservationConfig(
		config: ReservationConfigEntity,
		data: UpdateReservationConfigRequestDto
	) {
		config.maxPerson = data.maxPerson
		config.minCostPerPerson = data.minCostPerPerson
		config.timeLimit = data.timeLimit
		return config
	}

	async createReservationFacility(facilities: string[]) {
		const facilityEntities: ReservationFacilityEntity[] = []
		for (const facility of facilities) {
			const existingFacility = await this.getReservationFacilityByName(facility)
			if (!existingFacility) {
				facilityEntities.push(this.reservationFacilityRepository.create({ name: facility }))
			} else {
				facilityEntities.push(existingFacility)
			}
		}
		return facilityEntities
	}

	async getReservationFacilityByName(name: string) {
		return await this.reservationFacilityRepository.findOne({ name })
	}

	async getReservationFacilityByNameLike(name: string) {
		return await this.reservationFacilityRepository.find({ name: { $ilike: `%${name}%` } })
	}

	async getProfile(user_id: string): Promise<RestaurantEntity | null> {
		const restaurant = await this.restaurantRepository.findOne(
			{
				userData: { id: user_id }
			},
			{ populate: ['userData.restaurantData', 'themes'] }
		)
		return restaurant
	}

	async paginateRestaurant(query: PaginateRestaurantDto) {
		const { name, priceConditionIds, categoryIds, themeIds, paginationQuery } = query
		const filter: FilterQuery<RestaurantEntity> = {}
		if (name) {
			filter.userData = { name: { $ilike: `%${name}%` } }
		}
		if (priceConditionIds) {
			filter.menus = {
				$or: priceConditionIds.map((id) => {
					return {
						price: {
							$gte: PriceRange[id].minPrice,
							$lte: PriceRange[id].maxPrice
						}
					}
				})
			}
		}
		if (categoryIds) {
			filter.menus = { categories: { $in: categoryIds } }
		}
		if (themeIds) {
			filter.themes = { id: { $in: themeIds } }
		}
		const [items, count] = await this.restaurantRepository.findAndCount(filter, {
			populate: ['userData.restaurantData', 'themes'],
			offset: paginationQuery.page,
			limit: paginationQuery.pageSize
		})

		return {
			items,
			count
		}
	}

	async findRestaurantById(
		restaurantId: string,
		includeUnverified: boolean = false
	): Promise<RestaurantEntity | null> {
		return await this.restaurantRepository.findOne(
			{
				id: restaurantId
			},
			{
				populate: ['userData', 'userData.restaurantData', 'themes'],
				filters: { isAccountVerified: !includeUnverified }
			}
		)
	}

	async findAllUnverifiedRestaurant(query: GetAllUnverifiedRestaurantQueryDto) {
		const { name, themeIds } = query
		const filter: FilterQuery<RestaurantEntity> = {}
		if (name) {
			filter.userData = { name: { $ilike: `%${name}%` } }
		}
		if (themeIds) {
			filter.themes = { id: { $in: themeIds } }
		}
		filter.verificationStatus = { $eq: RestaurantVerificationStatus.UNVERIFIED }
		return await this.restaurantRepository.find(filter, {
			populate: ['userData', 'userData.restaurantData', 'themes'],
			filters: { isAccountVerified: false }
		})
	}

	async getNearestRestaurant(point: Point, radius: number) {
		const query = this.restaurantRepository
			.getEntityManager()
			.createQueryBuilder(RestaurantEntity, 'restaurant')
		const result = await query
			.select('*')
			.where(
				`ST_DWithin(
				ST_MakePoint(restaurant.location[0], restaurant.location[1])::geography,
				ST_MakePoint(${point.longitude}, ${point.latitude})::geography, ${radius})`
			)
			.leftJoinAndSelect('restaurant.userData', 'userData')
			.leftJoinAndSelect('userData.restaurantData', 'restaurantData')
			.leftJoinAndSelect('restaurant.themes', 'themes')
			.getResultList()
		return result
	}

	async getReservationConfig(restaurantId: string) {
		return await this.reservationConfigRepository.findOne(
			{
				restaurant: { id: restaurantId }
			},
			{
				populate: ['facilities', 'restaurant']
			}
		)
	}

	async getRestaurantThemes(themeIds: number[]): Promise<RestaurantThemeEntity[]> {
		const themes = await this.restaurantThemeRepository.find({
			id: { $in: themeIds }
		})
		return themes
	}

	async getRestaurantTheme(themeId: number): Promise<RestaurantThemeEntity | null> {
		return await this.restaurantThemeRepository.findOne({
			id: themeId
		})
	}

	async getAllRestaurantThemes(): Promise<RestaurantThemeEntity[]> {
		return await this.restaurantThemeRepository.findAll()
	}
}
