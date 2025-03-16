import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
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
import { FoodOrderMenuItemEntity } from './persistence/entity/food-order-menu-item.entity'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'
import {
	FoodOrderStatus,
	TransactionServiceType,
	TransactionStatus
} from '../../enums/transaction.enum'
import { FoodOrderTransactionMapper } from './domain/food-order-transaction.mapper'
import { RestaurantEntity } from '../restaurant/persistence/Restaurant.entity'
import { UpdateFoodOrderTransactionRequestDto } from './dto/update-food-order-transaction-request.dto'
import { UserEntity, UserRole } from '../user/persistance/User.entity'
import { FoodMenuCartDto } from './persistence/dto/food-menu-cart.dto'

@Injectable()
export class FoodOrderTransactionService {
	constructor(
		private readonly foodOrderTransactionDaoService: FoodOrderTransactionDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly menuItemDaoService: FoodMenuDaoService,
		private readonly transactionDaoService: TransactionDaoService,
		@Inject(forwardRef(() => FoodOrderTransactionGateway))
		private readonly transactionGateway: FoodOrderTransactionGateway,
		private readonly em: EntityManager
	) {}

	async createFoodOrderTransaction(
		customer: CustomerEntity,
		dto: CreateFoodOrderTransactionRequestDto
	) {
		const restaurant = await this.restaurantDaoService.getRestaurantById(dto.restaurantId)

		if (!restaurant) {
			throw new NotFoundException('Restaurant not found')
		}

		const menuItems = (
			await this.menuItemDaoService.findMenusByIds(dto.menuItems.map((item) => item.menuId))
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
			serviceType: TransactionServiceType.FOOD_ORDER,
			note: dto.note,
			status: TransactionStatus.ONGOING
		})

		const foodOrder = this.foodOrderTransactionDaoService.createFoodOrderTransaction({
			transactionId: transaction.id,
			status: FoodOrderStatus.PENDING
		})

		let orderItems: FoodOrderMenuItemEntity[] = []
		for (const menuItem of menuItems) {
			orderItems.push(
				this.foodOrderTransactionDaoService.createTransactionMenuItem({
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
		if (dto.status === FoodOrderStatus.REJECTED) {
			foodOrder.transaction.status = TransactionStatus.FAILED
		}
		if (dto.status === FoodOrderStatus.COMPLETED) {
			foodOrder.transaction.status = TransactionStatus.SUCCESS
		}
		foodOrder.status = dto.status
		await this.em.flush()
		const foodOrderTransactionDomain = FoodOrderTransactionMapper.toDomain(foodOrder)
		this.transactionGateway.notifyTrackOrder(foodOrderTransactionDomain!)
		return {
			transaction: foodOrderTransactionDomain
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

	async findRestaurantFoodOrderTransaction(
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
}
