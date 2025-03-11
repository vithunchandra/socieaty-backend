import { Injectable, NotFoundException } from '@nestjs/common'
import { FoodOrderEntity } from './entity/food-order-transaction.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateFoodOrderTransactionDto } from './dto/create-food-order-transaction.dto'
import { UpdateFoodOrderTransactionDto } from './dto/update-food-order-transaction'
import { CreateTransactionMenuItemDto } from './dto/create-transaction-menu-item.dto'
import { FoodOrderMenuItemEntity } from './entity/food-order-menu-item.entity'
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity'
import { FoodOrderStatus } from '../../../enums/transaction.enum'

@Injectable()
export class FoodOrderTransactionDaoService {
	constructor(
		@InjectRepository(FoodOrderEntity)
		private readonly foodOrderTransactionRepository: EntityRepository<FoodOrderEntity>,
		@InjectRepository(FoodOrderMenuItemEntity)
		private readonly transactionMenuItemRepository: EntityRepository<FoodOrderMenuItemEntity>
	) {}

	createFoodOrderTransaction(dto: CreateFoodOrderTransactionDto) {
		const foodOrderTransaction = this.foodOrderTransactionRepository.create({
			transaction: dto.transactionId,
			status: dto.status
		})
		return foodOrderTransaction
	}

	async findFoodOrderTransactionByTransactionId(transactionId: string) {
		const result = await this.foodOrderTransactionRepository.findOne(
			{
				transaction: { id: transactionId }
			},
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

	async findFoodOrderTransactionById(id: string) {
		const result = await this.foodOrderTransactionRepository.findOne(
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

	async findFoodOrderTransactionsByRestaurant(
		restaurant: RestaurantEntity,
		status: FoodOrderStatus[]
	) {
		const result = await this.foodOrderTransactionRepository.find(
			{
				transaction: { restaurant: { id: restaurant.id } },
				status: { $in: status }
			},
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

	async updateFoodOrderTransaction(
		foodOrderTransaction: FoodOrderEntity,
		dto: UpdateFoodOrderTransactionDto
	) {
		foodOrderTransaction.status = dto.status
		return foodOrderTransaction
	}

	createTransactionMenuItem(dto: CreateTransactionMenuItemDto): FoodOrderMenuItemEntity {
		const transactionMenuItem = this.transactionMenuItemRepository.create({
			foodOrder: dto.foodOrder,
			menu: dto.menu,
			quantity: dto.quantity,
			price: dto.menu.price,
			totalPrice: dto.menu.price * dto.quantity
		})

		this.transactionMenuItemRepository.getEntityManager().persist(transactionMenuItem)

		return transactionMenuItem
	}

	async findOrderMenuItemsByOrderId(id: string): Promise<FoodOrderMenuItemEntity[]> {
		return await this.transactionMenuItemRepository.find(
			{ foodOrder: { id } },
			{ populate: ['menu.categories'] }
		)
	}
}
