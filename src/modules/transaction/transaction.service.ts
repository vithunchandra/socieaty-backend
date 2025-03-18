import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TransactionDaoService } from './persistence/transaction.dao.service'
import { FoodMenuDaoService } from '../food-menu/persistence/food-menu.dao.service'
import { SERVICE_FEE } from '../../constants'
import { TransactionServiceType, FoodOrderStatus } from '../../enums/transaction.enum'
import { MenuItemEntity } from '../menu-items/persistence/menu-item.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { CustomerEntity } from '../customer/persistence/Customer.entity'
import { RestaurantDaoService } from '../restaurant/persistence/Restaurant.dao.service'
import { TransactionMapper } from './domain/transaction.mapper'
import { FoodOrderTransactionGateway } from '../food-order-transaction/food-order-transaction.gateway'
import { UpdateFoodOrderTransactionRequestDto } from '../food-order-transaction/dto/update-food-order-transaction-request.dto'
import { RestaurantEntity } from '../restaurant/persistence/entity/Restaurant.entity'
import { UserEntity, UserRole } from '../user/persistance/User.entity'

@Injectable()
export class TransactionService {
	constructor(
		private readonly transactionDaoService: TransactionDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly menuItemDaoService: FoodMenuDaoService,
		@Inject(forwardRef(() => FoodOrderTransactionGateway))
		private readonly transactionGateway: FoodOrderTransactionGateway,
		private readonly em: EntityManager
	) {}

	// async createTransaction(customer: CustomerEntity, dto: CreateFoodOrderTransactionRequestDto) {
	// 	const restaurant = await this.restaurantDaoService.getRestaurantById(dto.restaurantId)
	// 	if (!restaurant) {
	// 		throw new NotFoundException('Restaurant not found')
	// 	}
	// 	const menuItems = (
	// 		await this.menuItemDaoService.findMenusByIds(dto.menuItems.map((item) => item.menuId))
	// 	).map(
	// 		(item) =>
	// 			new FoodMenuCartDto(
	// 				item,
	// 				dto.menuItems.find((i) => i.menuId === item.id)?.quantity || 0
	// 			)
	// 	)
	// 	if (menuItems.length !== dto.menuItems.length) {
	// 		throw new NotFoundException('One or more menu items not found')
	// 	}

	// 	let totalPrice = 0
	// 	for (const menuItem of menuItems) {
	// 		if (!menuItem.menu.isStockAvailable) {
	// 			throw new BadRequestException(`Menu item ${menuItem.menu.name} is not available`)
	// 		}
	// 		if (menuItem.menu.restaurant.id !== restaurant.id) {
	// 			throw new BadRequestException(
	// 				`Menu item ${menuItem.menu.name} does not belong to the restaurant`
	// 			)
	// 		}
	// 		if (menuItem.quantity <= 0) {
	// 			throw new BadRequestException(`Quantity must be greater than 0`)
	// 		}
	// 		totalPrice += menuItem.menu.price * menuItem.quantity
	// 	}

	// 	if (customer.wallet < totalPrice + SERVICE_FEE) {
	// 		throw new BadRequestException('Insufficient balance')
	// 	}

	// 	const transaction = this.transactionDaoService.createTransaction({
	// 		restaurant: restaurant,
	// 		grossAmount: totalPrice,
	// 		serviceFee: SERVICE_FEE,
	// 		customer: customer,
	// 		serviceType: TransactionServiceType.FOOD_ORDER,
	// 		note: dto.note
	// 	})

	// 	let orderItems: TransactionMenuItemEntity[] = []
	// 	for (const menuItem of menuItems) {
	// 		orderItems.push(
	// 			this.transactionDaoService.createTransactionMenuItem({
	// 				menu: menuItem.menu,
	// 				quantity: menuItem.quantity,
	// 				transaction: transaction
	// 			})
	// 		)
	// 	}

	// 	await this.em.flush()
	// 	this.transactionGateway.notifyNewOrder(
	// 		TransactionMapper.toFoodOrderTransaction(transaction, orderItems)
	// 	)
	// 	return {
	// 		transaction: TransactionMapper.toFoodOrderTransaction(transaction, orderItems)
	// 	}
	// }

	// async updateOrderTransaction(
	// 	id: string,
	// 	restaurant: RestaurantEntity,
	// 	dto: UpdateFoodOrderTransactionRequestDto
	// ) {
	// 	const transaction = await this.transactionDaoService.findTransactionById(id)
	// 	if (!transaction) {
	// 		throw new NotFoundException('Transaction not found')
	// 	}
	// 	if (transaction.restaurant.id !== restaurant.id) {
	// 		throw new BadRequestException('Transaction does not belong to the restaurant')
	// 	}
	// 	if (transaction.serviceType !== TransactionServiceType.FOOD_ORDER) {
	// 		throw new BadRequestException('Transaction is not a food order')
	// 	}
	// 	transaction.status = dto.status
	// 	const menuItems = await this.transactionDaoService.findOrderMenuItemsByTransactionId(id)
	// 	await this.em.flush()
	// 	this.transactionGateway.notifyTrackOrder(
	// 		TransactionMapper.toFoodOrderTransaction(transaction, menuItems)
	// 	)
	// 	return {
	// 		transaction: TransactionMapper.toFoodOrderTransaction(transaction, menuItems)
	// 	}
	// }

	// async findFoodOrderTransactionByOrderId(orderId: string, user: UserEntity) {
	// 	const transaction = await this.transactionDaoService.findTransactionById(orderId)
	// 	if (!transaction) {
	// 		throw new NotFoundException('Transaction not found')
	// 	}
	// 	if (user.role === UserRole.CUSTOMER) {
	// 		if (transaction.customer.id !== user.customerData?.id) {
	// 			throw new BadRequestException('Transaction does not belong to the customer')
	// 		}
	// 	}
	// 	if (user.role === UserRole.RESTAURANT) {
	// 		if (transaction.restaurant.id !== user.restaurantData?.id) {
	// 			throw new BadRequestException('Transaction does not belong to the restaurant')
	// 		}
	// 	}
	// 	if (transaction.serviceType !== TransactionServiceType.FOOD_ORDER) {
	// 		throw new BadRequestException('Transaction is not a food order')
	// 	}
	// 	const menuItems =
	// 		await this.transactionDaoService.findOrderMenuItemsByTransactionId(orderId)
	// 	return {
	// 		transaction: TransactionMapper.toFoodOrderTransaction(transaction, menuItems)
	// 	}
	// }

	// async findRestaurantFoodOrderTransaction(
	// 	restaurant: RestaurantEntity,
	// 	status: FoodOrderStatus[]
	// ) {
	// 	const transactions = await this.transactionDaoService.findRestaurantFoodTransactions(
	// 		restaurant,
	// 		status
	// 	)
	// 	return {
	// 		transactions: transactions.map((transaction) =>
	// 			TransactionMapper.toFoodOrderTransaction(
	// 				transaction,
	// 				transaction.menuItems.getItems()
	// 			)
	// 		)
	// 	}
	// }

	// async trackOrder(orderId: string, customer: UserEntity) {
	// 	const { transaction } = await this.findFoodOrderTransactionByOrderId(orderId, customer)
	// 	await this.transactionGateway.trackOrder(customer, transaction)
	// 	return {
	// 		message: 'Order is being tracked'
	// 	}
	// }
}
