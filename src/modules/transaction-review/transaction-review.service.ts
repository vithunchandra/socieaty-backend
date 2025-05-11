import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TransactionReviewDaoService } from './persistence/transaction-review.dao.service'
import { CreateTransactionReviewRequestDto } from './dto/create-transaction-review-request.dto'
import { TransactionDaoService } from '../transaction/persistence/transaction.dao.service'
import { CustomerEntity } from '../customer/persistence/customer.entity'
import { TransactionStatus } from '../../enums/transaction.enum'
import { EntityManager } from '@mikro-orm/postgresql'
import { TransactionReviewMapper } from './domain/transaction-review.mapper'
import { GetAllRestaurantTransactionReviewsRequestDto } from './dto/get-all-restaurant-transaction-reviews-request.dto'

@Injectable()
export class TransactionReviewService {
	constructor(
		private readonly transactionReviewDaoService: TransactionReviewDaoService,
		private readonly transactionDaoService: TransactionDaoService,
		private readonly entityManager: EntityManager
	) {}

	async createTransactionReview(
		customer: CustomerEntity,
		data: CreateTransactionReviewRequestDto
	) {
		const transaction = await this.transactionDaoService.findTransactionById(data.transactionId)
		if (!transaction) {
			throw new NotFoundException('Transaksi tidak ditemukan')
		}
		if (transaction.id !== data.transactionId) {
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
			transactionId: data.transactionId,
			rating: data.rating,
			review: data.review
		})

		await this.entityManager.flush()
		const newTransactionReview =
			await this.transactionReviewDaoService.findTransactionReviewById(transactionReview.id)
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

	async getAllReviewByCustomerId(customerId: string) {
		const reviews = await this.transactionReviewDaoService.getReviewByCustomerId(customerId)
		return {
			reviews
		}
	}

	async getAllReviewByRestaurantId(
		restaurantId: string,
		data: GetAllRestaurantTransactionReviewsRequestDto
	) {
		const reviews = await this.transactionReviewDaoService.getReviewByRestaurantId(
			restaurantId,
			data.rating
		)
		let reviewCount = reviews.length
		let totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
		console.log(totalRating)
		var averageRating = 0
		if (reviews.length !== 0) {
			averageRating = totalRating / reviewCount
		}
		return {
			count: reviewCount,
			rating: averageRating,
			reviews: reviews.map((review) => TransactionReviewMapper.toDomain(review))
		}
	}
}
