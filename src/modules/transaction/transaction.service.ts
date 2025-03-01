import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { TransactionDaoService } from './persistence/transaction.dao.service'
import { CreateOrderTransactionRequestDto } from './dto/create-order-transaction-request.dto'
import { FoodMenuDaoService } from '../food-menu/persistence/food-menu.dao.service'
import { FoodMenuCartDto } from './dto/food-menu-cart.dto'
import { SERVICE_FEE } from '../../constants'
import { TransactionServiceType, TransactionStatus } from '../../enums/transaction.enum'
import { TransactionMenuItemEntity } from './persistence/entity/transaction-menu-item.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { CustomerEntity } from '../customer/persistence/Customer.entity'
import { RestaurantDaoService } from '../restaurant/persistence/Restaurant.dao.service'
import { TransactionMapper } from './domain/transaction.mapper'
import { TransactionGateway } from './transaction.gateway'
import { UpdateOrderTransactionRequestDto } from './dto/update-order-transaction-request.dto'
import { RestaurantEntity } from '../restaurant/persistence/Restaurant.entity'

@Injectable()
export class TransactionService {
	constructor(
		private readonly transactionDaoService: TransactionDaoService,
		private readonly restaurantDaoService: RestaurantDaoService,
		private readonly menuItemDaoService: FoodMenuDaoService,
		private readonly transactionGateway: TransactionGateway,
		private readonly em: EntityManager
	) {}

	async createTransaction(customer: CustomerEntity, dto: CreateOrderTransactionRequestDto) {
		console.log(dto)
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
			serviceType: TransactionServiceType.FOOD_ORDER
		})

		let orderItems: TransactionMenuItemEntity[] = []
		for (const menuItem of menuItems) {
			orderItems.push(
				this.transactionDaoService.createTransactionMenuItem({
					menu: menuItem.menu,
					quantity: menuItem.quantity,
					transaction: transaction
				})
			)
		}

		await this.em.flush()
		this.transactionGateway.notifyNewOrder(TransactionMapper.toFoodOrderTransaction(transaction, orderItems))
		return {
			transaction: TransactionMapper.toFoodOrderTransaction(transaction, orderItems)
		}
	}

	async updateOrderTransaction(id: string, restaurant: RestaurantEntity, dto: UpdateOrderTransactionRequestDto) {
		const transaction = await this.transactionDaoService.findTransactionById(id)
		if (!transaction) {
			throw new NotFoundException('Transaction not found')
		}
		if (transaction.restaurant.id !== restaurant.id) {
			throw new BadRequestException('Transaction does not belong to the restaurant')
		}
		if(transaction.serviceType !== TransactionServiceType.FOOD_ORDER) {
			throw new BadRequestException('Transaction is not a food order')
		}
		transaction.status = dto.status
		const menuItems = await this.transactionDaoService.findOrderMenuItemsByTransactionId(id)
		await this.em.flush()
		this.transactionGateway.notifyTrackOrder(TransactionMapper.toFoodOrderTransaction(transaction, menuItems))
		return {
			transaction: TransactionMapper.toFoodOrderTransaction(transaction, menuItems)
		}
	}
}
