import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ReservationEntity } from './reservation.entity'
import { EntityRepository, FilterQuery, OrderDefinition } from '@mikro-orm/postgresql'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { RestaurantEntity } from '../../restaurant/persistence/entity/Restaurant.entity'
import { ReservationStatus } from '../../../enums/reservation.enum'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { GetCustomerReservationsDto } from '../dto/get_customer_reservations.dto'
import { GetReservationsDto } from './dto/get-reservations.dto'
import { retry } from 'rxjs'
import { PaginateReservationsDto } from './dto/paginate-reservations.dto'

@Injectable()
export class ReservationDaoService {
	constructor(
		@InjectRepository(ReservationEntity)
		private readonly reservationRepository: EntityRepository<ReservationEntity>
	) {}
	populate = [
		'transaction',
		'transaction.customer.userData',
		'transaction.restaurant.userData',
		'transaction.restaurant.themes',
		'menuItems.menu.categories'
	]

	createReservationsQueryObject(query: GetReservationsDto) {
		const queryObject: FilterQuery<ReservationEntity> = {}
		const sortByObject: OrderDefinition<ReservationEntity> = {}

		if (query.customerId) {
			queryObject.transaction = { customer: { id: query.customerId } }
		}
		if (query.restaurantId) {
			queryObject.transaction = { restaurant: { id: query.restaurantId } }
		}
		if (query.createdAt) {
			queryObject.transaction = { createdAt: { $gte: query.createdAt } }
		}
		if (query.finishedAt) {
			queryObject.transaction = { finishedAt: { $lte: query.finishedAt } }
		}
		if (query.reservationTime) {
			const startOfDay = new Date(query.reservationTime)
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date(query.reservationTime)
			endOfDay.setHours(23, 59, 59, 999)

			queryObject.reservationTime = { $gte: startOfDay, $lte: endOfDay }
		}
		if (query.status) {
			queryObject.status = { $in: query.status }
		}
		if (query.sortBy && query.sortOrder) {
			if (query.sortBy === 'reservationTime') {
				sortByObject.reservationTime = query.sortOrder
			} else if (query.sortBy === 'createdAt' || query.sortBy === 'finishedAt') {
				sortByObject.transaction = { [query.sortBy]: query.sortOrder }
			}
		}

		return { queryObject, sortByObject }
	}

	createReservation(data: CreateReservationDto) {
		const reservation = this.reservationRepository.create({
			reservationTime: data.reservationTime,
			endTimeEstimation: data.endTimeEstimation,
			peopleSize: data.peopleSize,
			status: data.status,
			transaction: data.transactionId
		})
		return reservation
	}

	async findReservationByTransactionId(transactionId: string) {
		const result = await this.reservationRepository.findOne(
			{ transaction: { id: transactionId } },
			{
				populate: [
					'transaction',
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes',
					'menuItems.menu.categories'
				]
			}
		)
		return result
	}

	async findReservationById(id: string) {
		const result = await this.reservationRepository.findOne(
			{ id },
			{
				populate: [
					'transaction',
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes',
					'menuItems.menu.categories'
				]
			}
		)
		if (result?.reservationTime) {
			console.log(
				'Retrieved reservationTime (ISO/UTC):',
				result.reservationTime.toISOString(),
				'Local time:',
				result.reservationTime.toString()
			)
		}
		return result
	}

	async findReservations(query: GetReservationsDto) {
		const { queryObject, sortByObject } = this.createReservationsQueryObject(query)
		const result = await this.reservationRepository.find(queryObject, {
			populate: [
				'transaction',
				'transaction.customer.userData',
				'transaction.restaurant.userData',
				'transaction.restaurant.themes',
				'menuItems.menu.categories'
			],
			orderBy: sortByObject
		})

		return result
	}

	async paginateReservations(query: PaginateReservationsDto) {
		const { pageSize, page } = query.paginationQuery
		const { queryObject, sortByObject } = this.createReservationsQueryObject(query)
		const [items, count] = await this.reservationRepository.findAndCount(queryObject, {
			populate: [
				'transaction',
				'transaction.customer.userData',
				'transaction.restaurant.userData',
				'transaction.restaurant.themes',
				'menuItems.menu.categories'
			],
			orderBy: sortByObject,
			limit: pageSize,
			offset: page * pageSize
		})

		return {
			items,
			count
		}
	}

	async findReservationsByRestaurant(restaurant: RestaurantEntity, status: ReservationStatus[]) {
		const result = await this.reservationRepository.find(
			{ transaction: { restaurant: { id: restaurant.id } }, status: { $in: status } },
			{
				populate: [
					'transaction',
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes',
					'menuItems.menu.categories'
				]
			}
		)
		return result
	}

	async findReservationsByCustomer(customer: CustomerEntity, query: GetCustomerReservationsDto) {
		const queryObject: FilterQuery<ReservationEntity> = {
			transaction: { customer: { id: customer.id } }
		}
		if (query.status.length > 0) {
			queryObject.status = { $in: query.status }
		}

		const sortBy: OrderDefinition<ReservationEntity> = {
			reservationTime: 'desc'
		}
		if (query.sortBy && query.sortOrder) {
			sortBy[query.sortBy] = query.sortOrder
		}

		const result = await this.reservationRepository.find(queryObject, {
			populate: [
				'transaction',
				'transaction.customer.userData',
				'transaction.restaurant.userData',
				'transaction.restaurant.themes',
				'menuItems.menu.categories'
			],
			orderBy: sortBy
		})
		return result
	}
}
