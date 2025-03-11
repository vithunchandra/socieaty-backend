import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TransactionReviewDaoService } from './persistence/transaction-review.dao.service'
import { CreateTransactionReviewRequestDto } from './dto/create-transaction-review-request.dto'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'
import { CustomerEntity } from '../customer/persistence/Customer.entity'
import { TransactionStatus } from '../../enums/transaction.enum'
import { EntityManager } from '@mikro-orm/postgresql'
import { TransactionReviewMapper } from './domain/transaction-review.mapper'

@Injectable()
export class TransactionReviewService {
	constructor(
		private readonly transactionReviewDaoService: TransactionReviewDaoService,
		private readonly transactionDaoService: TransactionDaoService,
		private readonly entityManager: EntityManager
	) {}

	async createTransactionReview(
		customer: CustomerEntity,
		transactionId: string,
		data: CreateTransactionReviewRequestDto
	) {
		const transaction = await this.transactionDaoService.findTransactionById(transactionId)
		if (!transaction) {
			throw new NotFoundException('Transaksi tidak ditemukan')
		}
		if (transaction.id !== transactionId) {
			throw new BadRequestException('Transaksi tidak sesuai')
		}
		if (transaction.customer.id !== customer.id) {
			throw new ForbiddenException('Transaksi bukan milik user')
		}
		if (transaction.status !== TransactionStatus.SUCCESS) {
			throw new BadRequestException('Transaksi belum selesai')
		}
		if (transaction.review) {
			throw new BadRequestException('Transaksi sudah memiliki review')
		}
		if (data.rating < 1 || data.rating > 5) {
			throw new BadRequestException('Rating harus berada dalam rentang 1 hingga 5')
		}

		const transactionReview = await this.transactionReviewDaoService.createTransactionReview({
			transactionId: transactionId,
			rating: data.rating,
			review: data.review
		})

		await this.entityManager.flush()
		const newTransactionReview = await this.transactionReviewDaoService.findTransactionReviewById(transactionReview.id)
		return {
			review: TransactionReviewMapper.toDomain(newTransactionReview)
		}
	}

	async getReviewByTransactionId(transactionId: string) {
		const review =
			await this.transactionReviewDaoService.getReviewByTransactionId(transactionId)
		if (!review) {
			throw new NotFoundException('Review tidak ditemukan')
		}
		return {
			review
		}
	}

	async getReviewByCustomerId(customerId: string) {
		const reviews = await this.transactionReviewDaoService.getReviewByCustomerId(customerId)
		return {
			reviews
		}
	}

	async getReviewByRestaurantId(restaurantId: string) {
		const reviews = await this.transactionReviewDaoService.getReviewByRestaurantId(restaurantId)
		const reviewCount = reviews.length
		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
		const averageRating = totalRating / reviewCount
		return {
			reviewCount,
			averageRating,
			reviews
		}
	}
}
