import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { TransactionMessageDaoService } from './persistence/transaction-message.dao.service'
import { TransactionMessageGateway } from './transaction-message.gateway'
import { UserEntity, UserRole } from '../user/persistance/User.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { TransactionMessageMapper } from './domain/transaction-message.mapper'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'

@Injectable()
export class TransactionMessageService {
	constructor(
		private readonly transactionMessageDaoService: TransactionMessageDaoService,
        private readonly transactionDaoService: TransactionDaoService,
		private readonly transactionMessageGateway: TransactionMessageGateway,
		private readonly entityManager: EntityManager
	) {}

	async createTransactionMessage(user: UserEntity, transactionId: string, message: string) {
        const transaction = await this.transactionDaoService.findTransactionById(transactionId)
        if(!transaction) {
            throw new NotFoundException('Transaction not found')
        }
        if(user.role == UserRole.CUSTOMER) {
            if(user.customerData?.id != transaction.customer.id) {
                throw new ForbiddenException('You are not allowed to send messages to this transaction')
            }
        }
        if(user.role == UserRole.RESTAURANT) {
            if(user.restaurantData?.id != transaction.restaurant.id) {
                throw new ForbiddenException('You are not allowed to send messages to this transaction')
            }
        }
		const transactionMessage = await this.transactionMessageDaoService.createTransactionMessage({
            transactionId,
            message,
			userId: user.id
		})
        await this.entityManager.flush()
        const transactionMessageDomain = TransactionMessageMapper.toDomain(transactionMessage)!
		await this.transactionMessageGateway.notifyNewTransactionMessage(
			transactionMessage.transaction.id,
			transactionMessageDomain
		)

        return {
            transactionMessage: transactionMessageDomain
        }
	}

    async trackTransactionMessage(user: UserEntity, transactionId: string) {
        const transaction = await this.transactionDaoService.findTransactionById(transactionId)
        if(!transaction) {
            throw new NotFoundException('Transaction not found')
        }
        if(user.role == UserRole.CUSTOMER) {
            if(user.customerData?.id != transaction.customer.id) {
                throw new ForbiddenException('You are not allowed to send messages to this transaction')
            }
        }
        if(user.role == UserRole.RESTAURANT) {
            if(user.restaurantData?.id != transaction.restaurant.id) {
                throw new ForbiddenException('You are not allowed to send messages to this transaction')
            }
        }
		
        const transactionMessages = await this.transactionMessageDaoService.getTransactionMessagesByTransactionId(transactionId)
        await this.transactionMessageGateway.trackTransactionMessage(user, transactionId)
        return {
            transactionMessages: transactionMessages.map(TransactionMessageMapper.toDomain)
        }
    }
}
