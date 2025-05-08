import { Injectable } from '@nestjs/common'
import { TransactionEntity } from './transaction.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, FilterQuery, OrderDefinition } from '@mikro-orm/postgresql'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { PaginateTransactionsQueryDto } from './dto/paginate-transactions-query.dto'
import { FindTransactionsQueryDto } from './dto/find-transactions-query.dto'

@Injectable()
export class TransactionDaoService {
	constructor(
		@InjectRepository(TransactionEntity)
		private readonly transactionRepository: EntityRepository<TransactionEntity>
	) {}

	createTransactionQueryObject(query: FindTransactionsQueryDto) {
		const {
			rangeStartDate,
			rangeEndDate,
			status,
			sortBy,
			sortOrder,
			searchQuery,
			customerId,
			restaurantId,
			serviceType
		} = query
		const queryObject: FilterQuery<TransactionEntity> = {}
		const sortByObject: OrderDefinition<TransactionEntity> = {}

		if (customerId) {
			queryObject.customer = { id: customerId }
		}
		if (restaurantId) {
			queryObject.restaurant = { id: restaurantId }
		}
		if (status) {
			queryObject.status = { $in: status }
		}
		if (serviceType) {
			queryObject.serviceType = { $eq: serviceType }
		}
		if (rangeStartDate) {
			queryObject.createdAt = { $gte: rangeStartDate }
		}
		if (rangeEndDate) {
			queryObject.finishedAt = { $lte: rangeEndDate }
		}
		if (searchQuery) {
			queryObject.$or = [
				{ note: { $like: `%${searchQuery}%` } },
				{ customer: { userData: { name: { $like: `%${searchQuery}%` } } } },
				{ restaurant: { userData: { name: { $like: `%${searchQuery}%` } } } }
			]
		}

		if (sortBy && sortOrder) {
			sortByObject[sortBy] = sortOrder
		}

		return { queryObject, sortByObject }
	}

	createTransaction(dto: CreateTransactionDto): TransactionEntity {
		const transaction = this.transactionRepository.create({
			restaurant: dto.restaurant,
			customer: dto.customer,
			serviceType: dto.serviceType,
			grossAmount: dto.grossAmount,
			netAmount: dto.netAmount,
			serviceFee: dto.serviceFee,
			refundAmount: dto.refundAmount,
			note: dto.note,
			status: dto.status
		})

		return transaction
	}

	async findTransactionById(id: string): Promise<TransactionEntity | null> {
		return await this.transactionRepository.findOne(
			{ id: id },
			{ populate: ['restaurant.userData', 'restaurant.themes', 'customer.userData'] }
		)
	}

	async paginateTransactions(query: PaginateTransactionsQueryDto) {
		const { pageSize, page } = query.paginationQuery
		const { queryObject, sortByObject } = this.createTransactionQueryObject(query)

		const [items, count] = await this.transactionRepository.findAndCount(queryObject, {
			populate: [
				'foodOrder.menuItems.menu.categories',
				'reservation.menuItems.menu.categories',
				'customer.userData',
				'restaurant.userData',
				'restaurant.themes'
			],
			orderBy: sortByObject,
			limit: pageSize,
			offset: page * pageSize
		})

		return { items, count }
	}

	async findAllTransactions(query: FindTransactionsQueryDto) {
		const { queryObject, sortByObject } = this.createTransactionQueryObject(query)

		const result = await this.transactionRepository.find(queryObject, {
			populate: [
				'foodOrder.menuItems.menu.categories',
				'reservation.menuItems.menu.categories',
				'customer.userData',
				'restaurant.userData',
				'restaurant.themes'
			],
			orderBy: sortByObject
		})

		return result
	}

	// async findRestaurantFoodTransactions(restaurant: RestaurantEntity, status: FoodOrderStatus[]) {
	// 	return await this.transactionRepository.find(
	// 		{
	// 			restaurant,
	// 			finishedAt: null
	// 		},
	// 		{
	// 			populate: [
	// 				'restaurant.userData',
	// 				'restaurant.themes',
	// 				'customer.userData',
	// 				'menuItems.menu.categories'
	// 			]
	// 		}
	// 	)
	// }
}
