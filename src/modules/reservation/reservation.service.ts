import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ReservationDaoService } from './persistence/reservation.dao.service'
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto'
import { CustomerEntity } from '../customer/persistence/Customer.entity'
import { RestaurantDaoService } from '../restaurant/persistence/Restaurant.dao.service'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'
import { FoodMenuDaoService } from '../food-menu/persistence/food-menu.dao.service'
import { FoodMenuCartDto } from '../food-order-transaction/persistence/dto/food-menu-cart.dto'
import { SERVICE_FEE } from '../../constants'
import { TransactionServiceType, TransactionStatus } from '../../enums/transaction.enum'
import { MenuItemEntity } from '../menu-items/persistence/menu-item.entity'
import { MenuItemDaoService } from '../menu-items/persistence/menu-item.dao.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { ReservationStatus } from '../../enums/reservation.enum'
import { ReservationTransactionMapper } from './domain/reservation-transaction.mapper'
import { UserEntity, UserRole } from '../user/persistance/User.entity'
import { UpdateReservationRequestDto } from './dto/update-reservation-request.dto'
import { RestaurantEntity } from '../restaurant/persistence/entity/Restaurant.entity'

@Injectable()
export class ReservationService {
	constructor(
		private readonly reservationDaoService: ReservationDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly transactionDaoService: TransactionDaoService,
		private readonly foodMenuDaoService: FoodMenuDaoService,
		private readonly menuItemDaoService: MenuItemDaoService,
		private readonly em: EntityManager
	) {}

	async createReservation(customer: CustomerEntity, dto: CreateReservationRequestDto) {
		const restaurant = await this.restaurantDaoService.getRestaurantById(dto.restaurantId)
		if (!restaurant) {
			throw new NotFoundException('Restaurant tidak ditemukan')
		}
		if (!restaurant.isReservationAvailable) {
			throw new BadRequestException('Restaurant tidak membuka reservasi')
		}
		const reservationConfig = await this.restaurantDaoService.getReservationConfig(
			dto.restaurantId
		)
		if (!reservationConfig) {
			throw new NotFoundException('Restaurant tidak memiliki konfigurasi reservasi')
		}

		const menuItems = (
			await this.foodMenuDaoService.findMenusByIds(dto.menuItems.map((item) => item.menuId))
		).map(
			(item) =>
				new FoodMenuCartDto(
					item,
					dto.menuItems.find((i) => i.menuId === item.id)?.quantity || 0
				)
		)

		if (menuItems.length !== dto.menuItems.length) {
			throw new NotFoundException('One or more menu items not found')
		}

		let totalPrice = 0
		for (const menuItem of menuItems) {
			if (!menuItem.menu.isStockAvailable) {
				throw new BadRequestException(`Menu item ${menuItem.menu.name} is not available`)
			}
			if (menuItem.menu.restaurant.id !== restaurant.id) {
				throw new BadRequestException(
					`Menu item ${menuItem.menu.name} does not belong to the restaurant`
				)
			}
			if (menuItem.quantity <= 0) {
				throw new BadRequestException(`Quantity must be greater than 0`)
			}
			totalPrice += menuItem.menu.price * menuItem.quantity
		}

		if (customer.wallet < totalPrice + SERVICE_FEE) {
			throw new BadRequestException('Insufficient balance')
		}

		const transaction = this.transactionDaoService.createTransaction({
			restaurant: restaurant,
			grossAmount: totalPrice,
			serviceFee: SERVICE_FEE,
			customer: customer,
			serviceType: TransactionServiceType.RESERVATION,
			note: dto.note,
			status: TransactionStatus.ONGOING
		})

		const reservation = this.reservationDaoService.createReservation({
			transactionId: transaction.id,
			endTimeEstimation: new Date(
				dto.reservationTime.getTime() + reservationConfig.timeLimit * 60000
			),
			status: ReservationStatus.PENDING,
			peopleSize: dto.peopleSize,
			reservationTime: dto.reservationTime
		})

		let reservationMenuItems: MenuItemEntity[] = []
		for (const menuItem of menuItems) {
			reservationMenuItems.push(
				this.menuItemDaoService.createFoodOrderMenuItem({
					menu: menuItem.menu,
					quantity: menuItem.quantity,
					reservation: reservation
				})
			)
		}

		await this.em.flush()

		const reservationTransaction =
			await this.reservationDaoService.findReservationByTransactionId(transaction.id)
		const reservationDomain = ReservationTransactionMapper.toDomain(reservationTransaction)

		return {
			reservation: reservationDomain
		}
	}

    async updateReservation(id: string, restaurant: RestaurantEntity, dto: UpdateReservationRequestDto){
		const reservation = await this.reservationDaoService.findReservationById(id)
		if (!reservation) {
			throw new NotFoundException('Transaction not found')
		}
		if (reservation.transaction.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Transaction does not belong to the restaurant')
		}
		if (reservation.transaction.serviceType !== TransactionServiceType.RESERVATION) {
			throw new BadRequestException('Transaction is not a reservation')
		}
		if (dto.status === ReservationStatus.CONFIRMED) {
			reservation.status = ReservationStatus.CONFIRMED
		}
		if (dto.status === ReservationStatus.CANCELED) {
			reservation.status = ReservationStatus.CANCELED
			reservation.transaction.finishedAt = new Date()
		}
		if (dto.status === ReservationStatus.COMPLETED) {
			reservation.status = ReservationStatus.COMPLETED
			reservation.transaction.finishedAt = new Date()
		}
		reservation.status = dto.status
		await this.em.flush()
		const updatedReservation = await this.em.refresh(reservation)
		const reservationDomain = ReservationTransactionMapper.toDomain(updatedReservation)
		return {
			reservation: reservationDomain
		}
	}

    async findReservationById(id: string, user: UserEntity){
        const reservation =
			await this.reservationDaoService.findReservationById(id)
		if (!reservation) {
			throw new NotFoundException('Transaction not found')
		}
		if (user.role === UserRole.CUSTOMER) {
			if (reservation.transaction.customer.id !== user.customerData?.id) {
				throw new BadRequestException('Transaction does not belong to the customer')
			}
		}
		if (user.role === UserRole.RESTAURANT) {
			if (reservation.transaction.restaurant.id !== user.restaurantData?.id) {
				throw new BadRequestException('Transaction does not belong to the restaurant')
			}
		}

		return {
			transaction: ReservationTransactionMapper.toDomain(reservation)
		}
    }
}
