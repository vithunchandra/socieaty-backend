import { EntityRepository } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { TransactionMessageEntity } from './transaction-message.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateTransactionMessageDto } from './dto/create-transaction-message.dto'
import { populate } from 'dotenv'

@Injectable()
export class TransactionMessageDaoService {
	constructor(
		@InjectRepository(TransactionMessageEntity)
		private readonly transactionMessageRepository: EntityRepository<TransactionMessageEntity>
	) {}

	async createTransactionMessage(dto: CreateTransactionMessageDto) {
		const transactionMessage = this.transactionMessageRepository.create({
			message: dto.message,
			transaction: dto.transactionId,
			user: dto.userId
		})
		return transactionMessage
	}

	async getTransactionMessagesByTransactionId(transactionId: string) {
		return this.transactionMessageRepository.find(
			{
				transaction: transactionId
			},
			{ populate: ['user'], orderBy: { createdAt: 'asc' } }
		)
	}
}
