import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { TransactionDaoService } from './persistence/transaction.dao.service'
import { TransactionStatus } from '../../enums/transaction.enum'
import { EntityManager } from '@mikro-orm/postgresql'
import { FoodOrderTransactionGateway } from '../food-order-transaction/food-order-transaction.gateway'

import { TransactionEntity } from './persistence/transaction.entity'
import { CreateTransactionDto } from './persistence/dto/create-transaction.dto'

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
}
