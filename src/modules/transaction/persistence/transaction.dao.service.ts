import { Injectable } from '@nestjs/common'
import { TransactionEntity } from './entity/transaction.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/postgresql'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { TransactionStatus } from '../../../enums/transaction.enum'
import { CreateTransactionMenuItemDto } from './dto/create-transaction-menu-item.dto'
import { TransactionMenuItemEntity } from './entity/transaction-menu-item.entity'
import { RestaurantEntity } from '../../restaurant/persistence/Restaurant.entity'

@Injectable()
export class TransactionDaoService {
	constructor(
		@InjectRepository(TransactionEntity)
		private readonly transactionRepository: EntityRepository<TransactionEntity>,
		@InjectRepository(TransactionMenuItemEntity)
		private readonly transactionMenuItemRepository: EntityRepository<TransactionMenuItemEntity>
	) {}

	createTransaction(dto: CreateTransactionDto): TransactionEntity {
		const transaction = this.transactionRepository.create({
			restaurant: dto.restaurant,
			customer: dto.customer,
			serviceType: dto.serviceType,
			grossAmount: dto.grossAmount,
			serviceFee: dto.serviceFee,
			status: TransactionStatus.PENDING,
			note: dto.note
		})

		this.transactionRepository.getEntityManager().persist(transaction)

		return transaction
	}

	createTransactionMenuItem(dto: CreateTransactionMenuItemDto): TransactionMenuItemEntity {
		const transactionMenuItem = this.transactionMenuItemRepository.create({
			transaction: dto.transaction,
			menu: dto.menu,
			quantity: dto.quantity,
			price: dto.menu.price,
			totalPrice: dto.menu.price * dto.quantity
		})

		this.transactionMenuItemRepository.getEntityManager().persist(transactionMenuItem)

		return transactionMenuItem
	}

	async findTransactionById(id: string): Promise<TransactionEntity | null> {
		return await this.transactionRepository.findOne(
			{ id },
			{ populate: ['restaurant.userData', 'restaurant.themes', 'customer.userData'] }
		)
	}

	async findRestaurantFoodTransactions(
		restaurant: RestaurantEntity,
		status: TransactionStatus[]
	) {
		return await this.transactionRepository.find(
			{
				restaurant,
				status: { $in: status }
			},
			{
				populate: [
					'restaurant.userData',
					'restaurant.themes',
					'customer.userData',
					'menuItems.menu.categories'
				]
			}
		)
	}

	async findOrderMenuItemsByTransactionId(id: string): Promise<TransactionMenuItemEntity[]> {
		return await this.transactionMenuItemRepository.find(
			{ transaction: { id } },
			{ populate: ['menu.categories'] }
		)
	}
}
