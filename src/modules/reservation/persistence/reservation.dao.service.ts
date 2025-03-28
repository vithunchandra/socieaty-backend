import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ReservationEntity } from './reservation.entity'
import { EntityRepository, FilterQuery, OrderDefinition } from '@mikro-orm/postgresql'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { RestaurantEntity } from '../../restaurant/persistence/entity/Restaurant.entity'
import { ReservationStatus } from '../../../enums/reservation.enum'
import { CustomerEntity } from '../../customer/persistence/Customer.entity'
import { GetCustomerReservationsDto } from '../dto/get_customer_reservations.dto'

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
		return result
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
		if(query.sortBy && query.sortOrder){
			sortBy[query.sortBy] = query.sortOrder
		}

		const result = await this.reservationRepository.find(
			queryObject,
			{
				populate: [
					'transaction',
					'transaction.customer.userData',
					'transaction.restaurant.userData',
					'transaction.restaurant.themes',
					'menuItems.menu.categories'
				],
				orderBy: sortBy
			}
		)
		return result
	}
}
