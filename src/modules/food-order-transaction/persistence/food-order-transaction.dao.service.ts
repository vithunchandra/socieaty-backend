import { Injectable, NotFoundException } from '@nestjs/common'
import { FoodOrderEntity } from './entity/food-order-transaction.entity'
import { EntityRepository, FilterQuery, OrderDefinition } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateFoodOrderTransactionDto } from './dto/create-food-order-transaction.dto'
import { UpdateFoodOrderTransactionDto } from './dto/update-food-order-transaction'
import { RestaurantEntity } from '../../restaurant/persistence/entity/restaurant.entity'
import { FoodOrderStatus } from '../../../enums/food-order.enum'
import { CustomerEntity } from '../../customer/persistence/customer.entity'
import { GetPaginatedOrdersDto } from './dto/get-paginated-orders.dto'
import { GetOrdersDto } from './dto/get-orders.dto'

@Injectable()
export class FoodOrderTransactionDaoService {
	constructor(
		@InjectRepository(FoodOrderEntity)
		private readonly foodOrderTransactionRepository: EntityRepository<FoodOrderEntity>
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

	createFoodOrdersQueryObject(dto: GetOrdersDto) {
		const queryObject: FilterQuery<FoodOrderEntity> = {}
		const sortObject: OrderDefinition<FoodOrderEntity> = {}
		if (dto.customerId) {
			queryObject.transaction = { customer: { id: dto.customerId } }
		}
		if (dto.restaurantId) {
			queryObject.transaction = { restaurant: { id: dto.restaurantId } }
		}
		if (dto.status) {
			queryObject.status = { $in: dto.status }
		}
		if (dto.createdAt) {
			queryObject.transaction = { createdAt: { $gte: dto.createdAt } }
		}
		if (dto.finishedAt) {
			queryObject.transaction = { finishedAt: { $lte: dto.finishedAt } }
		}
		if (dto.sortBy && dto.sortOrder) {
			sortObject[dto.sortBy] = dto.sortOrder
		}
		return { queryObject, sortObject }
	}

	async paginateFoodOrders(dto: GetPaginatedOrdersDto) {
		const { queryObject, sortObject } = this.createFoodOrdersQueryObject(dto)
		const { pageSize, page } = dto.paginationQuery
		const [items, count] = await this.foodOrderTransactionRepository.findAndCount(queryObject, {
			populate: [
				'transaction',
				'transaction.customer.userData',
				'transaction.restaurant.userData',
				'transaction.restaurant.themes',
				'menuItems.menu.categories'
			],
			orderBy: sortObject,
			limit: pageSize,
			offset: page * pageSize
		})
		return {
			items,
			count
		}
	}

	async findFoodOrders(dto: GetOrdersDto) {
		const { queryObject, sortObject } = this.createFoodOrdersQueryObject(dto)
		const result = await this.foodOrderTransactionRepository.find(queryObject, {
			populate: [
				'transaction',
				'transaction.customer.userData',
				'transaction.restaurant.userData',
				'transaction.restaurant.themes',
				'menuItems.menu.categories'
			],
			orderBy: sortObject
		})
		return result
	}

	async findFoodOrderTransactionsByCustomer(customer: CustomerEntity, status: FoodOrderStatus[]) {
		const result = await this.foodOrderTransactionRepository.find(
			{ transaction: { customer: { id: customer.id } }, status: { $in: status } },
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
}
