import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	StreamableFile
} from '@nestjs/common'
import { FoodOrderTransactionDaoService } from './persistence/food-order-transaction.dao.service'
import { CreateFoodOrderTransactionDto } from './persistence/dto/create-food-order-transaction.dto'
import { CreateFoodOrderTransactionRequestDto } from './dto/create-order-transaction-request.dto'
import { CustomerEntity } from '../customer/persistence/Customer.entity'
import { RestaurantDaoService } from '../restaurant/persistence/Restaurant.dao.service'
import { FoodMenuDaoService } from '../food-menu/persistence/food-menu.dao.service'
import { FoodOrderTransactionGateway } from './food-order-transaction.gateway'
import { EntityManager } from '@mikro-orm/postgresql'
import { SERVICE_FEE } from '../../constants'
import { MenuItemEntity } from '../menu-items/persistence/menu-item.entity'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'
import { TransactionServiceType, TransactionStatus } from '../../enums/transaction.enum'
import { FoodOrderTransactionMapper } from './domain/food-order-transaction.mapper'
import { RestaurantEntity } from '../restaurant/persistence/entity/Restaurant.entity'
import { UpdateFoodOrderTransactionRequestDto } from './dto/update-food-order-transaction-request.dto'
import { UserEntity, UserRole } from '../user/persistance/User.entity'
import { FoodMenuCartDto } from './persistence/dto/food-menu-cart.dto'
import { MenuItemDaoService } from '../menu-items/persistence/menu-item.dao.service'
import { TransactionService } from '../transaction/transaction.service'
import { FoodOrderEntity } from './persistence/entity/food-order-transaction.entity'
import { SchedulerService } from '../scheduler/scheduler.service'
import { QRCodeService } from '../qr-code/qr-code.service'
import { FoodOrderStatus } from '../../enums/food-order.enum'
import { PaginateOrdersRequestQueryDto } from './dto/paginate-orders-request-query.dto'
import { PaginationDto } from '../../dto/pagination.dto'
import { GetOrdersRequestQueryDto } from './dto/get-orders-request-query.dto'

@Injectable()
export class FoodOrderTransactionService {
	constructor(
		private readonly foodOrderTransactionDaoService: FoodOrderTransactionDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly foodMenuDaoService: FoodMenuDaoService,
		private readonly menuItemDaoService: MenuItemDaoService,
		private readonly transactionService: TransactionService,
		@Inject(forwardRef(() => FoodOrderTransactionGateway))
		private readonly transactionGateway: FoodOrderTransactionGateway,
		private readonly schedulerService: SchedulerService,
		private readonly qrCodeService: QRCodeService,
		private readonly em: EntityManager
	) {}

	async createFoodOrderTransaction(
		customer: CustomerEntity,
		dto: CreateFoodOrderTransactionRequestDto
	) {
		const restaurant = await this.restaurantDaoService.findRestaurantById(dto.restaurantId)

		if (!restaurant) {
			throw new NotFoundException('Restaurant not found')
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
			serviceType: TransactionServiceType.FOOD_ORDER,
			note: dto.note,
			status: TransactionStatus.ONGOING
		})

		const foodOrder = this.foodOrderTransactionDaoService.createFoodOrderTransaction({
			transactionId: transaction.id,
			status: FoodOrderStatus.PENDING
		})

		let orderItems: MenuItemEntity[] = []
		for (const menuItem of menuItems) {
			orderItems.push(
				this.menuItemDaoService.createFoodOrderMenuItem({
					menu: menuItem.menu,
					quantity: menuItem.quantity,
					foodOrder: foodOrder
				})
			)
		}

		await this.em.flush()

		const foodOrderTransaction =
			await this.foodOrderTransactionDaoService.findFoodOrderTransactionByTransactionId(
				transaction.id
			)
		const foodOrderTransactionDomain = FoodOrderTransactionMapper.toDomain(foodOrderTransaction)

		this.transactionGateway.notifyNewOrder(foodOrderTransactionDomain!)

		this.schedulerService.addTimeout(
			`autoRejectFoodOrder-${foodOrder.id}`,
			async () => {
				let timeoutFoodOrder =
					await this.foodOrderTransactionDaoService.findFoodOrderTransactionById(
						foodOrder.id
					)
				if (!timeoutFoodOrder) {
					return
				}
				if (timeoutFoodOrder.status !== FoodOrderStatus.PENDING) {
					return
				}
				this.rejectFoodOrder(timeoutFoodOrder)
				timeoutFoodOrder.status = FoodOrderStatus.REJECTED
				await this.em.flush()
				timeoutFoodOrder = await this.em.refresh(timeoutFoodOrder)
				const foodOrderTransactionDomain =
					FoodOrderTransactionMapper.toDomain(timeoutFoodOrder)
				this.transactionGateway.notifyTrackOrder(foodOrderTransactionDomain!)
				this.transactionGateway.notifyOrderChanges(foodOrderTransactionDomain!)
			},
			1000 * 30
		)

		return {
			transaction: foodOrderTransactionDomain
		}
	}

	async updateFoodOrderTransaction(
		id: string,
		restaurant: RestaurantEntity,
		dto: UpdateFoodOrderTransactionRequestDto
	) {
		const foodOrder = await this.foodOrderTransactionDaoService.findFoodOrderTransactionById(id)
		if (!foodOrder) {
			throw new NotFoundException('Transaction not found')
		}
		if (foodOrder.transaction.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Transaction does not belong to the restaurant')
		}
		if (foodOrder.transaction.serviceType !== TransactionServiceType.FOOD_ORDER) {
			throw new BadRequestException('Transaction is not a food order')
		}

		if (dto.status === FoodOrderStatus.PREPARING) {
			if (foodOrder.status !== FoodOrderStatus.PENDING) {
				throw new BadRequestException('Food order is not pending')
			}
			this.schedulerService.deleteTimeout(`autoRejectFoodOrder-${foodOrder.id}`)
		}
		if (dto.status === FoodOrderStatus.REJECTED) {
			if (foodOrder.status !== FoodOrderStatus.PENDING) {
				throw new BadRequestException('Food order is not pending')
			}
			this.rejectFoodOrder(foodOrder)
		}
		if (dto.status === FoodOrderStatus.COMPLETED) {
			if (foodOrder.status !== FoodOrderStatus.READY) {
				throw new BadRequestException('Food order is not ready')
			}
			this.completeFoodOrder(foodOrder)
		}

		foodOrder.status = dto.status
		await this.em.flush()
		const foodOrderTransactionDomain = FoodOrderTransactionMapper.toDomain(foodOrder)
		this.transactionGateway.notifyTrackOrder(foodOrderTransactionDomain!)
		return {
			transaction: foodOrderTransactionDomain
		}
	}

	completeFoodOrder(foodOrder: FoodOrderEntity) {
		if (foodOrder.status !== FoodOrderStatus.READY) {
			throw new BadRequestException('Food order is not ready')
		}
		this.transactionService.finishTransaction(foodOrder.transaction)
		return foodOrder
	}

	rejectFoodOrder(foodOrder: FoodOrderEntity) {
		if (foodOrder.status !== FoodOrderStatus.PENDING) {
			throw new BadRequestException('Food order is not pending')
		}
		this.transactionService.failTransaction(foodOrder.transaction)
		return foodOrder
	}

	async cancelFoodOrder(foodOrder: FoodOrderEntity) {
		if (foodOrder.status !== FoodOrderStatus.PENDING) {
			throw new BadRequestException('Food order is not pending')
		}
		this.transactionService.failTransaction(foodOrder.transaction)
	}

	async paginateFoodOrders(user: UserEntity, dto: PaginateOrdersRequestQueryDto) {
		console.log(dto)
		console.log(user)
		if (user.role !== UserRole.ADMIN) {
			if (user.role === UserRole.CUSTOMER && dto.customerId !== user.customerData?.id) {
				throw new BadRequestException('Customer does not have access to this order')
			}
			if (user.role === UserRole.RESTAURANT && dto.restaurantId !== user.restaurantData?.id) {
				throw new BadRequestException('Restaurant does not have access to this order')
			}
		}
		const { items, count } = await this.foodOrderTransactionDaoService.paginateFoodOrders(dto)
		const pagination = PaginationDto.createPaginationDto(
			count,
			dto.paginationQuery.pageSize,
			dto.paginationQuery.page
		)
		return {
			items: items.map((item) => FoodOrderTransactionMapper.toDomain(item)),
			pagination
		}
	}

	async findOrders(user: UserEntity, dto: GetOrdersRequestQueryDto) {
		if (user.role !== UserRole.ADMIN) {
			if (user.role === UserRole.CUSTOMER && dto.customerId !== user.customerData?.id) {
				throw new BadRequestException('Customer does not have access to this order')
			}
			if (user.role === UserRole.RESTAURANT && dto.restaurantId !== user.restaurantData?.id) {
				throw new BadRequestException('Restaurant does not have access to this order')
			}
		}
		const orders = await this.foodOrderTransactionDaoService.findFoodOrders(dto)
		return {
			orders: orders.map((order) => FoodOrderTransactionMapper.toDomain(order))
		}
	}

	async findFoodOrderTransactionByOrderId(orderId: string, user: UserEntity) {
		const foodOrder =
			await this.foodOrderTransactionDaoService.findFoodOrderTransactionById(orderId)
		if (!foodOrder) {
			throw new NotFoundException('Transaction not found')
		}
		if (user.role === UserRole.CUSTOMER) {
			if (foodOrder.transaction.customer.id !== user.customerData?.id) {
				throw new BadRequestException('Transaction does not belong to the customer')
			}
		}
		if (user.role === UserRole.RESTAURANT) {
			if (foodOrder.transaction.restaurant.id !== user.restaurantData?.id) {
				throw new BadRequestException('Transaction does not belong to the restaurant')
			}
		}

		return {
			transaction: FoodOrderTransactionMapper.toDomain(foodOrder)
		}
	}

	async findCustomerFoodOrderTransaction(customer: CustomerEntity, status: FoodOrderStatus[]) {
		const foodOrder =
			await this.foodOrderTransactionDaoService.findFoodOrderTransactionsByCustomer(
				customer,
				status
			)
		return {
			transactions: foodOrder.map((transaction) =>
				FoodOrderTransactionMapper.toDomain(transaction)
			)
		}
	}

	async findRestaurantFoodOrderTransactions(
		restaurant: RestaurantEntity,
		status: FoodOrderStatus[]
	) {
		const foodOrder =
			await this.foodOrderTransactionDaoService.findFoodOrderTransactionsByRestaurant(
				restaurant,
				status
			)
		return {
			transactions: foodOrder.map((transaction) =>
				FoodOrderTransactionMapper.toDomain(transaction)
			)
		}
	}

	async trackOrder(orderId: string, customer: UserEntity) {
		const { transaction } = await this.findFoodOrderTransactionByOrderId(orderId, customer)
		await this.transactionGateway.trackOrder(customer, transaction!)
		return {
			message: 'Order is being tracked'
		}
	}

	async generateQRCode(user: UserEntity, id: string) {
		const { transaction } = await this.findFoodOrderTransactionByOrderId(id, user)
		if (!transaction) {
			throw new NotFoundException('Food order not found')
		}
		const qrCode = await this.qrCodeService.generateQrCodeBuffer(transaction.orderId)
		return new StreamableFile(qrCode, {
			type: 'image/png'
		})
	}
}
