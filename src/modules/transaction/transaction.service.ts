import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { TransactionDaoService } from './persistence/transaction.dao.service'
import { TransactionServiceType, TransactionStatus } from '../../enums/transaction.enum'
import { EntityManager } from '@mikro-orm/postgresql'
import { FoodOrderTransactionGateway } from '../food-order-transaction/food-order-transaction.gateway'

import { TransactionEntity } from './persistence/transaction.entity'
import { CreateTransactionDto } from './persistence/dto/create-transaction.dto'
import { PaginateTransactionsRequestQueryDto } from './dto/paginate-transactions-request-query.dto'
import { UserEntity, UserRole } from '../user/persistance/User.entity'
import { TransactionMapper } from './domain/transaction.mapper'
import { PaginationDto } from '../../dto/pagination.dto'
import { GetTransactionsInsightRequestQueryDto } from './dto/get-transactions-insight-request-query.dto'

@Injectable()
export class TransactionService {
	constructor(
		private readonly transactionDaoService: TransactionDaoService,
		@Inject(forwardRef(() => FoodOrderTransactionGateway))
		private readonly em: EntityManager
	) {}

	createTransaction(dto: CreateTransactionDto) {
		dto.customer.wallet -= dto.grossAmount
		const transaction = this.transactionDaoService.createTransaction(dto)
		return transaction
	}

	async refundTransaction(transaction: TransactionEntity, refundAmount: number) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		if (refundAmount > transaction.grossAmount - transaction.serviceFee) {
			throw new BadRequestException('Refund amount is greater than the transaction amount')
		}
		if (refundAmount < 0) {
			throw new BadRequestException('Refund amount is less than 0')
		}
		transaction.refundAmount = refundAmount
		transaction.customer.wallet += refundAmount
		transaction.restaurant.wallet += transaction.netAmount - refundAmount
		transaction.status = TransactionStatus.REFUNDED
		transaction.finishedAt = new Date()
		return transaction
	}

	async failTransaction(transaction: TransactionEntity) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		transaction.status = TransactionStatus.FAILED
		transaction.refundAmount = transaction.grossAmount
		transaction.customer.wallet += transaction.grossAmount
		transaction.finishedAt = new Date()
		return transaction
	}

	async finishTransaction(transaction: TransactionEntity) {
		if (transaction.status !== TransactionStatus.ONGOING) {
			throw new BadRequestException('Transaction is not ongoing')
		}
		transaction.status = TransactionStatus.SUCCESS
		transaction.restaurant.wallet += transaction.netAmount
		transaction.finishedAt = new Date()
		return transaction
	}

	async paginateTransactions(user: UserEntity, query: PaginateTransactionsRequestQueryDto) {
		if (
			user.role !== UserRole.ADMIN &&
			(user.id !== query.customerId || user.id !== query.restaurantId)
		) {
			throw new UnauthorizedException('You are not authorized to access this resource')
		}

		const { items, count } = await this.transactionDaoService.paginateTransactions(query)
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)
		return {
			items: items.map((item) => TransactionMapper.toDomain(item)),
			pagination
		}
	}

	async getTransactionsInsight(user: UserEntity, query: GetTransactionsInsightRequestQueryDto) {
		if (user.role !== UserRole.ADMIN && (user.id !== query.restaurantId || user.id !== query.customerId)) {
			throw new UnauthorizedException('You are not authorized to access this resource')
		}
		const transactions = await this.transactionDaoService.findAllTransactions(query)


		
		let totalIncome = 0
		let totalFailedTransactions = 0
		let totalSuccessTransactions = 0
		let totalFoodOrderTransactions = 0
		let totalReservationTransactions = 0

		for (const transaction of transactions) {
			if (transaction.status === TransactionStatus.SUCCESS) {
				totalSuccessTransactions++
				if(user.role === UserRole.RESTAURANT) {
					totalIncome += transaction.netAmount
				}else if(user.role === UserRole.ADMIN) {
					totalIncome += transaction.serviceFee
				}
			}
			if (transaction.status === TransactionStatus.FAILED) {
				totalFailedTransactions++
			}
			if (transaction.serviceType === TransactionServiceType.FOOD_ORDER) {
				totalFoodOrderTransactions++
			}
			if (transaction.serviceType === TransactionServiceType.RESERVATION) {
				totalReservationTransactions++
			}
		}
		return {
			totalIncome,
			totalFailedTransactions,
			totalSuccessTransactions,
			totalFoodOrderTransactions,
			totalReservationTransactions
		}
	}
}
