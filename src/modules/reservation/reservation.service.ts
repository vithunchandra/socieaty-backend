import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
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
import { ReservationGateway } from './reservation.gateway'
import { GetCustomerReservationsDto } from './dto/get_customer_reservations.dto'
import { QRCodeService } from '../qr-code/qr-code.service'
import { TransactionService } from '../transaction/transaction.service'
import { ReservationEntity } from './persistence/reservation.entity'
import { SchedulerService } from '../scheduler/scheduler.service'
import { GetReservationsRequestQueryDto } from './dto/get-reservations-request-query.dto'
import { PaginationDto } from '../../dto/pagination.dto'
import { PaginateOrdersRequestQueryDto } from './dto/paginate-reservation-request-query.dto'

@Injectable()
export class ReservationService {
	constructor(
		private readonly reservationDaoService: ReservationDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly transactionService: TransactionService,
		private readonly foodMenuDaoService: FoodMenuDaoService,
		private readonly menuItemDaoService: MenuItemDaoService,
		private readonly reservationGateway: ReservationGateway,
		private readonly qrCodeService: QRCodeService,
		private readonly schedulerService: SchedulerService,
		private readonly em: EntityManager
	) {}

	async createReservation(customer: CustomerEntity, dto: CreateReservationRequestDto) {
		const restaurant = await this.restaurantDaoService.findRestaurantById(dto.restaurantId)
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

		const transaction = this.transactionService.createTransaction({
			restaurant: restaurant,
			grossAmount: totalPrice + SERVICE_FEE,
			netAmount: totalPrice,
			refundAmount: 0,
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

		this.reservationGateway.notifyNewReservation(reservationDomain!)

		this.schedulerService.addTimeout(
			`autoRejectReservation-${reservation.id}`,
			async () => {
				let timeoutReservation = await this.reservationDaoService.findReservationById(
					reservation.id
				)
				if (!timeoutReservation) {
					return
				}
				if (timeoutReservation.status !== ReservationStatus.PENDING) {
					return
				}
				this.rejectReservation(timeoutReservation)
				timeoutReservation.status = ReservationStatus.REJECTED
				await this.em.flush()
				timeoutReservation = await this.em.refresh(timeoutReservation)
				const timeoutReservationDomain =
					ReservationTransactionMapper.toDomain(timeoutReservation)
				this.reservationGateway.notifyTrackReservation(timeoutReservationDomain!)
				this.reservationGateway.notifyReservationChanges(timeoutReservationDomain!)
			},
			1000 * 30
		)

		return {
			reservation: reservationDomain
		}
	}

	async updateReservation(
		id: string,
		restaurant: RestaurantEntity,
		dto: UpdateReservationRequestDto
	) {
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
			if (reservation.status !== ReservationStatus.PENDING) {
				throw new BadRequestException('Reservation is not in pending state')
			}
			this.schedulerService.deleteTimeout(`autoRejectReservation-${reservation.id}`)
		}
		if (dto.status === ReservationStatus.REJECTED) {
			if (reservation.status !== ReservationStatus.PENDING) {
				throw new BadRequestException('Reservation is not in pending state')
			}
			this.rejectReservation(reservation)
		}
		if (dto.status === ReservationStatus.CANCELED) {
			if (reservation.status !== ReservationStatus.CONFIRMED) {
				throw new BadRequestException('Reservation is not in confirmed state')
			}
			this.cancelReservation(reservation)
		}
		if (dto.status === ReservationStatus.COMPLETED) {
			if (reservation.status !== ReservationStatus.DINING) {
				throw new BadRequestException('Reservation is not in dining state')
			}
			this.completeReservation(reservation)
		}

		reservation.status = dto.status
		await this.em.flush()
		const updatedReservation = await this.em.refresh(reservation)
		const reservationDomain = ReservationTransactionMapper.toDomain(updatedReservation)

		this.reservationGateway.notifyTrackReservation(reservationDomain!)

		return {
			reservation: reservationDomain
		}
	}

	rejectReservation(reservation: ReservationEntity) {
		if (reservation.status !== ReservationStatus.PENDING) {
			throw new BadRequestException('Reservation is not in pending state')
		}
		this.transactionService.failTransaction(reservation.transaction)
		return reservation
	}

	cancelReservation(reservation: ReservationEntity) {
		if (reservation.status !== ReservationStatus.CONFIRMED) {
			throw new BadRequestException('Reservation is not in confirmed state')
		}
		this.transactionService.failTransaction(reservation.transaction)
		return reservation
	}

	completeReservation(reservation: ReservationEntity) {
		if (reservation.status !== ReservationStatus.DINING) {
			throw new BadRequestException('Reservation is not in dining state')
		}
		this.transactionService.finishTransaction(reservation.transaction)
		return reservation
	}

	async scanCustomerReservation(restaurant: RestaurantEntity, reservationId: string) {
		const reservation = await this.reservationDaoService.findReservationById(reservationId)
		if (!reservation) {
			throw new NotFoundException('Transaction not found')
		}
		if (reservation.transaction.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Transaction does not belong to the restaurant')
		}
		if (reservation.transaction.serviceType !== TransactionServiceType.RESERVATION) {
			throw new BadRequestException('Transaction is not a reservation')
		}
		if (reservation.status !== ReservationStatus.CONFIRMED) {
			throw new BadRequestException('Reservasi tidak valid')
		}

		reservation.status = ReservationStatus.DINING
		await this.em.flush()
		const updatedReservation = await this.em.refresh(reservation)
		const reservationDomain = ReservationTransactionMapper.toDomain(updatedReservation)

		this.reservationGateway.notifyTrackReservation(reservationDomain!)

		return {
			reservation: reservationDomain
		}
	}

	async getReservations(user: UserEntity, query: GetReservationsRequestQueryDto) {
		if (user.role !== UserRole.ADMIN) {
			if (user.role === UserRole.CUSTOMER && user.customerData?.id !== query.customerId) {
				throw new BadRequestException('Customer does not have access to this reservation')
			}
			if (
				user.role === UserRole.RESTAURANT &&
				user.restaurantData?.id !== query.restaurantId
			) {
				throw new BadRequestException('Transaction does not belong to the restaurant')
			}
		}
		const reservations = await this.reservationDaoService.findReservations({
			...query
		})
		return {
			reservations: reservations.map((reservation) =>
				ReservationTransactionMapper.toDomain(reservation)
			)
		}
	}

	async paginateReservations(user: UserEntity, query: PaginateOrdersRequestQueryDto) {
		if (user.role !== UserRole.ADMIN) {
			if (user.role === UserRole.CUSTOMER && user.customerData?.id !== query.customerId) {
				throw new BadRequestException('Customer does not have access to this reservation')
			}
			if (
				user.role === UserRole.RESTAURANT &&
				user.restaurantData?.id !== query.restaurantId
			) {
				throw new BadRequestException('Transaction does not belong to the restaurant')
			}
		}
		const { items, count } = await this.reservationDaoService.paginateReservations({
			...query
		})
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)
		return {
			items: items.map((reservation) => ReservationTransactionMapper.toDomain(reservation)),
			pagination
		}
	}

	async getReservationById(id: string, user: UserEntity) {
		const reservation = await this.reservationDaoService.findReservationById(id)
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
		const reservationDomain = ReservationTransactionMapper.toDomain(reservation)
		return {
			reservation: reservationDomain
		}
	}

	async getRestaurantReservations(restaurant: RestaurantEntity, status: ReservationStatus[]) {
		const reservations = await this.reservationDaoService.findReservationsByRestaurant(
			restaurant,
			status
		)
		return {
			reservations: reservations.map((reservation) =>
				ReservationTransactionMapper.toDomain(reservation)
			)
		}
	}

	async getCustomerReservations(customer: CustomerEntity, query: GetCustomerReservationsDto) {
		const reservations = await this.reservationDaoService.findReservationsByCustomer(
			customer,
			query
		)
		return {
			reservations: reservations.map((reservation) =>
				ReservationTransactionMapper.toDomain(reservation)
			)
		}
	}

	async trackReservation(id: string, user: UserEntity) {
		const { reservation } = await this.getReservationById(id, user)
		this.reservationGateway.trackReservation(user, reservation!)
		return {
			message: 'Reservation is being tracked'
		}
	}

	async generateQRCode(user: UserEntity, id: string) {
		const { reservation } = await this.getReservationById(id, user)
		if (!reservation) {
			throw new NotFoundException('Reservation not found')
		}
		const qrCode = await this.qrCodeService.generateQrCodeBuffer(reservation.reservationId)
		return new StreamableFile(qrCode, {
			type: 'image/png'
		})
	}
}
