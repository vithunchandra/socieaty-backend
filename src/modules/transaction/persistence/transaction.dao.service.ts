import { Injectable } from '@nestjs/common'
import { TransactionEntity } from './transaction.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/postgresql'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { FoodOrderStatus, TransactionStatus } from '../../../enums/transaction.enum'
import { CreateMenuItemDto } from '../../menu-items/persistence/dto/create-menu-item.dto'
import { MenuItemEntity } from '../../menu-items/persistence/menu-item.entity'
import { RestaurantEntity } from '../../restaurant/persistence/entity/Restaurant.entity'

@Injectable()
export class TransactionDaoService {
	constructor(
		@InjectRepository(TransactionEntity)
		private readonly transactionRepository: EntityRepository<TransactionEntity>
	) {}

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
