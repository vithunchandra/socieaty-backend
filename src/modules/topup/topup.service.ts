import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common'
import { TopupDaoService } from './persistence/topup.dao.service'
import { CustomerEntity } from '../customer/persistence/customer.entity'
import { CreateTopupRequestDto } from './dto/create-topup-request.dto'
import { MidtransService } from '../midtrans/midtrans.service'
import { CreateSnapTransactionResponseDto } from '../midtrans/dto/create-snap-transaction-response.dto'
import { EntityManager } from '@mikro-orm/postgresql'
import { TopupMapper } from './domain/topup.mapper'
import { TopupNotificationRequestDto } from './dto/topup-notification-request.dto'
import { FraudStatus, PaymentStatus, TopupStatus } from '../../enums/topup.enum'
import { UserMapper } from '../user/domain/user.mapper'
import { TopupGateway } from './topup.gateway'
import { UserEntity } from '../user/persistance/user.entity'

@Injectable()
export class TopupService {
	constructor(
		private readonly topupDaoService: TopupDaoService,
		private readonly midtransService: MidtransService,
		private readonly topupGateway: TopupGateway,
		private readonly em: EntityManager
	) {}

	async createTopup(customer: CustomerEntity, createTopupRequestDto: CreateTopupRequestDto) {
		const topupEntity = this.topupDaoService.createTopup({
			customer: customer,
			amount: createTopupRequestDto.grossAmount
		})

		let snapTransactionResponse: CreateSnapTransactionResponseDto
		try {
			snapTransactionResponse = await this.midtransService.createTopupTransaction({
				orderId: topupEntity.id,
				grossAmount: createTopupRequestDto.grossAmount,
				customer: customer
			})
		} catch (error) {
			throw new InternalServerErrorException('Failed to create topup transaction')
		}

		topupEntity.snapToken = snapTransactionResponse.token
		topupEntity.snapRedirectUrl = snapTransactionResponse.redirectUrl
		await this.em.flush()

		console.log(topupEntity)
		return {
			topup: TopupMapper.toDomain(topupEntity)
		}
	}

	async trackTopup(user: UserEntity, topupId: string) {
		const topupEntity = await this.topupDaoService.getTopupById(topupId)
		if (!topupEntity) {
			throw new BadRequestException('Topup not found')
		}
		if (topupEntity.customer.id !== user.customerData!.id) {
			throw new ForbiddenException('You are not allowed to track this topup')
		}
		this.topupGateway.trackTopupNotification(user, topupEntity.id)
		return {
			topup: TopupMapper.toDomain(topupEntity)
		}
	}

	async handleTopupNotification(topupNotificationRequestDto: TopupNotificationRequestDto) {
		if (!this.midtransService.isValidTopupNotification(topupNotificationRequestDto)) {
			throw new BadRequestException('Invalid topup notification')
		}
		const topupEntity = await this.topupDaoService.getTopupById(
			topupNotificationRequestDto.order_id
		)
		if (!topupEntity) {
			throw new BadRequestException('Topup not found')
		}
		if (topupEntity.status === TopupStatus.SUCCESS) {
			throw new BadRequestException('Topup already processed')
		}
		console.log('hallo')

		if (
			topupNotificationRequestDto.transaction_status === PaymentStatus.SETTLEMENT &&
			topupNotificationRequestDto.fraud_status === FraudStatus.DENY
		) {
			throw new BadRequestException('Fraud transaction')
		}

		let customer = topupEntity.customer
		if (topupNotificationRequestDto.transaction_status === PaymentStatus.SETTLEMENT) {
			topupEntity.status = TopupStatus.SUCCESS
			topupEntity.transactionId = topupNotificationRequestDto.transaction_id
			topupEntity.settlementTime = topupNotificationRequestDto.settlement_time
			topupEntity.paymentType = topupNotificationRequestDto.payment_type
			customer.wallet += topupEntity.amount
		} else if (topupNotificationRequestDto.transaction_status === PaymentStatus.PENDING) {
			topupEntity.status = TopupStatus.PENDING
		} else if (topupNotificationRequestDto.transaction_status === PaymentStatus.EXPIRE) {
			topupEntity.status = TopupStatus.EXPIRED
		} else {
			topupEntity.status = TopupStatus.FAILED
		}

		await this.em.flush()

		const newCustomerData = await this.em.refresh(customer)

		this.topupGateway.notifyTopupNotification(topupEntity.id, {
			customer: UserMapper.fromCustomerToDomain(newCustomerData!),
			topup: TopupMapper.toDomain(topupEntity)
		})

		return {
			topup: TopupMapper.toDomain(topupEntity),
			customer: UserMapper.fromCustomerToDomain(newCustomerData!)
		}
	}
}
