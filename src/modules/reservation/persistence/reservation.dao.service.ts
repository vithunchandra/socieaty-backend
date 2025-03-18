import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ReservationEntity } from './reservation.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { CreateReservationDto } from './dto/create-reservation.dto'

@Injectable()
export class ReservationDaoService {
	constructor(
		@InjectRepository(ReservationEntity)
		private readonly reservationRepository: EntityRepository<ReservationEntity>
	) {}

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
}
